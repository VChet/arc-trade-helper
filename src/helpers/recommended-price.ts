import { convertToMs } from "@/helpers/format";
import type { MetaForgeLiveTrade } from "@/types/api";

interface Metrics {
  totalWeight: number
  tradeCount: number
  batchTradeCount: number
  /** value in ms */
  latestTrade: number
  spread: number
}
export interface RecommendedPrice {
  price: number | null
  metrics: Metrics | null
  confidence: "low" | "medium" | "high"
}

interface WeightedPrice {
  price: number
  weight: number
  time: number
}

export const TRADE_CONFIG = {
  windowMs: convertToMs(7 * 24, "hours"),
  batchQuantity: 5,
  recencyHalfLife: convertToMs(24, "hours")
};
const CONFIDENCE_THRESHOLDS = {
  low: { minTradeWeight: 3, maxAge: convertToMs(72, "hours"), maxRelativeSpread: 0.5 },
  high: { minTradeWeight: 5, minBatchTradeCount: 3, maxAge: convertToMs(24, "hours"), maxRelativeSpread: 0.3 }
};

function getRecencyWeightModifier(age: number): number {
  return 2 ** (-age / TRADE_CONFIG.recencyHalfLife);
}

function getConfidence(
  totalWeight: number,
  batchTradeCount: number,
  latestTrade: number,
  relativeSpread: number
): RecommendedPrice["confidence"] {
  const { low, high } = CONFIDENCE_THRESHOLDS;
  if (
    totalWeight < low.minTradeWeight ||
    latestTrade > low.maxAge ||
    relativeSpread > low.maxRelativeSpread
  ) { return "low"; }

  if (
    totalWeight >= high.minTradeWeight &&
    batchTradeCount >= high.minBatchTradeCount &&
    latestTrade <= high.maxAge &&
    relativeSpread <= high.maxRelativeSpread
  ) { return "high"; }

  return "medium";
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

export function calculateRecommendedPrice(trades: MetaForgeLiveTrade[]): RecommendedPrice {
  const now = Date.now();
  const windowStart = now - TRADE_CONFIG.windowMs;

  const prices: WeightedPrice[] = [];
  let batchTradeCount = 0;
  let latestTradeTime = 0;

  for (const trade of trades) {
    const time = Date.parse(trade.timestamp);
    const { price_in_seeds: price, item: { quantity } } = trade;
    if (
      time < windowStart ||
      time > now ||
      price <= 0 ||
      quantity <= 0
    ) { continue; }

    if (quantity >= TRADE_CONFIG.batchQuantity) batchTradeCount++;

    prices.push({ price, time, weight: getRecencyWeightModifier(now - time) });

    latestTradeTime = Math.max(latestTradeTime, time);
  }

  if (!prices.length) return { price: null, metrics: null, confidence: "low" };

  const totalWeight = prices.reduce((acc, { weight }) => acc + weight, 0);
  prices.sort((a, b) => a.price - b.price);
  const firstQuartile = weightedQuantile(prices, totalWeight, 0.25);
  const price = weightedQuantile(prices, totalWeight, 0.5);
  const thirdQuartile = weightedQuantile(prices, totalWeight, 0.75);
  const relativeSpread = (thirdQuartile - firstQuartile) / price;
  const latestTrade = now - latestTradeTime;

  return {
    price: Math.round(price),
    metrics: {
      totalWeight,
      tradeCount: prices.length,
      batchTradeCount,
      latestTrade,
      spread: relativeSpread
    },
    confidence: getConfidence(totalWeight, batchTradeCount, latestTrade, relativeSpread)
  };
}
