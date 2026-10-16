import type { MetaForgeTradeInterval } from "@/types/api";

export interface RecommendedPrice {
  price: number | null
  confidence: "low" | "medium" | "high"
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const TARGET_TRADES = 10;
const CONFIDENCE_THRESHOLDS = {
  low: {
    minEffectiveTrades: 5,
    maxAgeHours: 72,
    maxRelativeSpread: 0.5
  },
  high: {
    minEffectiveTrades: 10,
    maxAgeHours: 24,
    maxRelativeSpread: 0.15
  }
};

interface WeightedPrice {
  price: number
  weight: number
}
interface ValidInterval {
  interval: MetaForgeTradeInterval
  quality: number
  weight: number
}

function weightedQuantile(prices: WeightedPrice[], totalWeight: number, quantile: number): number {
  const threshold = totalWeight * quantile;
  let accumulatedWeight = 0;
  for (const { price, weight } of prices) {
    accumulatedWeight += weight;
    if (accumulatedWeight >= threshold) return price;
  }
  return prices.at(-1)!.price;
}

function calculateQuality(interval: MetaForgeTradeInterval): number {
  const { min_price, max_price, median_price } = interval;
  const relativeRange = (max_price - min_price) / median_price;
  return 1 / (1 + relativeRange);
}

export function calculateRecommendedPrice(history: MetaForgeTradeInterval[]): RecommendedPrice {
  const now = Date.now();
  const windowStart = now - SEVEN_DAYS_MS;

  const intervals = history.filter(({ time, median_price, trade_count }) =>
    time >= windowStart &&
    time <= now &&
    median_price > 0 &&
    trade_count > 0
  ).sort((a, b) => b.time - a.time);

  if (!intervals.length) return { price: null, confidence: "low" };

  // Collect recent intervals until the target number of trades is met
  const sample: MetaForgeTradeInterval[] = [];
  let sampleTrades = 0;
  for (const interval of intervals) {
    sample.push(interval);
    sampleTrades += interval.trade_count;
    if (sampleTrades >= TARGET_TRADES) break;
  }
  // Apply a quality penalty to intervals with a wide price range
  const validSample: ValidInterval[] = sample
    .map((interval) => {
      const quality = calculateQuality(interval);
      return { interval, quality, weight: interval.trade_count * quality };
    })
    .filter(({ weight }) => weight > 0);

  if (!validSample.length) return { price: null, confidence: "low" };

  const effectiveTrades = validSample.reduce((acc, { weight }) => acc + weight, 0);
  const prices = validSample
    .map(({ interval, weight }) => ({ price: interval.median_price, weight }))
    .sort((a, b) => a.price - b.price);

  const totalWeight = prices.reduce((acc, entry) => acc + entry.weight, 0);

  const price = weightedQuantile(prices, totalWeight, 0.5);
  const recommendedPrice = Math.round(price);

  const firstQuartile = weightedQuantile(prices, totalWeight, 0.25);
  const thirdQuartile = weightedQuantile(prices, totalWeight, 0.75);
  const relativeSpread = (thirdQuartile - firstQuartile) / price;
  const latestAgeHours = (now - intervals[0].time) / (60 * 60 * 1000);

  // Low confidence: insufficient trades, old data, wide spread
  if (
    effectiveTrades < CONFIDENCE_THRESHOLDS.low.minEffectiveTrades ||
    latestAgeHours > CONFIDENCE_THRESHOLDS.low.maxAgeHours ||
    relativeSpread > CONFIDENCE_THRESHOLDS.low.maxRelativeSpread
  ) {
    return { price: recommendedPrice, confidence: "low" };
  }
  // High confidence: sufficient trades, recent data, narrow spread
  if (
    effectiveTrades >= CONFIDENCE_THRESHOLDS.high.minEffectiveTrades &&
    latestAgeHours <= CONFIDENCE_THRESHOLDS.high.maxAgeHours &&
    relativeSpread <= CONFIDENCE_THRESHOLDS.high.maxRelativeSpread
  ) {
    return { price: recommendedPrice, confidence: "high" };
  }

  return { price: recommendedPrice, confidence: "medium" };
}
