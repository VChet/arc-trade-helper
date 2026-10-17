import { convertToMs } from "@/helpers/format";
import type { MetaForgeTradeInterval } from "@/types/api";

interface Metrics {
  tradeCount: number
  latestInterval: number
  spread: number
}
export interface RecommendedPrice {
  price: number | null
  metrics: Metrics | null
  confidence: "low" | "medium" | "high"
}

const SEVEN_DAYS_MS = convertToMs(7 * 24, "hours");
const MIN_SAMPLE_TRADE_COUNT = 10;
const CONFIDENCE_THRESHOLDS = {
  low: { minEffectiveTradeCount: 5, maxAgeHours: 72, maxRelativeSpread: 0.5 },
  high: { minEffectiveTradeCount: 10, maxAgeHours: 24, maxRelativeSpread: 0.15 }
};

interface WeightedPrice {
  price: number
  weight: number
}

function getConfidence(effectiveTradeCount: number, ageHours: number, relativeSpread: number): RecommendedPrice["confidence"] {
  const { low, high } = CONFIDENCE_THRESHOLDS;
  if (
    effectiveTradeCount < low.minEffectiveTradeCount ||
    ageHours > low.maxAgeHours ||
    relativeSpread > low.maxRelativeSpread
  ) { return "low"; }

  if (
    effectiveTradeCount >= high.minEffectiveTradeCount &&
    ageHours <= high.maxAgeHours &&
    relativeSpread <= high.maxRelativeSpread
  ) { return "high"; }

  return "medium";
}

function weightedQuantiles(prices: WeightedPrice[], totalEffectiveTradeCount: number): [number, number, number] {
  const thresholds = [0.25, 0.5, 0.75].map((quantile) => totalEffectiveTradeCount * quantile);
  const lastPrice = prices.at(-1)!.price;
  const quantiles: [number, number, number] = [lastPrice, lastPrice, lastPrice];
  let accumulatedWeight = 0;
  let quantileIndex = 0;

  for (const { price, weight } of prices) {
    accumulatedWeight += weight;
    while (quantileIndex < thresholds.length && accumulatedWeight >= thresholds[quantileIndex]) {
      quantiles[quantileIndex++] = price;
    }
    if (quantileIndex === quantiles.length) break;
  }

  return quantiles;
}

function calculateQuality({ min_price, max_price, median_price }: MetaForgeTradeInterval): number {
  const relativeRange = (max_price - min_price) / median_price;
  return 1 / (1 + relativeRange);
}

export function calculateRecommendedPrice(history: MetaForgeTradeInterval[]): RecommendedPrice {
  const now = Date.now();
  const windowStart = now - SEVEN_DAYS_MS;

  // Keep recent intervals with valid prices and trades
  const intervals = history.filter(({ time, median_price, trade_count }) =>
    time >= windowStart &&
    time <= now &&
    median_price > 0 &&
    trade_count > 0
  ).sort((a, b) => b.time - a.time);

  if (!intervals.length) return { price: null, metrics: null, confidence: "low" };

  const prices: WeightedPrice[] = [];
  let sampleTradeCount = 0;
  let totalEffectiveTradeCount = 0;
  // Give less weight to intervals with wider price ranges
  for (const interval of intervals) {
    sampleTradeCount += interval.trade_count;
    const effectiveTradeCount = interval.trade_count * calculateQuality(interval);
    if (effectiveTradeCount > 0) {
      prices.push({ price: interval.median_price, weight: effectiveTradeCount });
      totalEffectiveTradeCount += effectiveTradeCount;
    }
    if (sampleTradeCount >= MIN_SAMPLE_TRADE_COUNT) break;
  }

  if (!prices.length) return { price: null, metrics: null, confidence: "low" };

  // Use the middle price as the recommendation and price spread to set confidence
  prices.sort((a, b) => a.price - b.price);
  const [firstQuartile, price, thirdQuartile] = weightedQuantiles(prices, totalEffectiveTradeCount);
  const recommendedPrice = Math.round(price);
  const relativeSpread = (thirdQuartile - firstQuartile) / price;
  const latestAgeHours = (now - intervals[0].time) / convertToMs(1, "hours");

  return {
    price: recommendedPrice,
    metrics: { tradeCount: sampleTradeCount, latestInterval: latestAgeHours, spread: relativeSpread },
    confidence: getConfidence(totalEffectiveTradeCount, latestAgeHours, relativeSpread)
  };
}
