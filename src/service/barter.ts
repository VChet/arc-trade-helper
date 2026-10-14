import { ARC_PART_IDS } from "@/constants/items";
import itemsData from "../data/items.json" with { type: "json" };
import type { InventoryEntry, Item, NomadTraderEntry, PriceEntry } from "@/types/item";

interface CalculateBarterParams {
  inventory: InventoryEntry[]
  prices: PriceEntry[]
  traderItems: NomadTraderEntry[]
}

export interface ArcPartResult {
  itemId: Item["id"]
  name: string
  quantity: number
  seedPrice: number
  credValue: number
  totalCredValue: number
}

export interface TraderOption {
  itemId: Item["id"]
  name: string
  quantityPerBundle: number
  bundlePrice: number
  affordableBundles: number
  totalQuantity: number
  remainingCredValue: number
}

export interface BarterPlan {
  inventorySeedValue: number
  remainingSeeds: number
  arcParts: ArcPartResult[]
  totalCredValue: number
  traderOptions: TraderOption[]
  unpricedItems: { id: Item["id"], quantity: number }[]
}

export function calculateBarter({ inventory, prices, traderItems }: CalculateBarterParams): BarterPlan {
  const priceMap = new Map(prices.map(({ itemId, price }) => [itemId, price]));
  const unpricedItems: BarterPlan["unpricedItems"] = [];
  const existingArcParts: ArcPartResult[] = [];

  let inventorySeedValue = 0;
  let existingCredValue = 0;

  // Count existing Arc Parts, convert other items into seed value
  for (const { itemId, quantity } of inventory) {
    if (quantity <= 0) continue;

    const item = itemsData[itemId];
    // Count seed value
    if (itemId === "assorted-seeds") {
      inventorySeedValue += quantity;
      continue;
    }
    // Count Arc Parts value
    if (ARC_PART_IDS.includes(itemId)) {
      const { credValue, name } = item;
      existingArcParts.push({
        itemId,
        name,
        quantity,
        seedPrice: 0,
        credValue,
        totalCredValue: credValue * quantity
      });
      existingCredValue += credValue * quantity;
      continue;
    }
    // Count other items
    const price = priceMap.get(itemId) ?? 0;
    if (price) {
      inventorySeedValue += price * quantity;
    } else {
      unpricedItems.push({ id: itemId, quantity });
    }
  }

  const seedBudget = Math.floor(inventorySeedValue);
  // Arc Parts to purchase
  const parts = ARC_PART_IDS.flatMap((itemId) => {
    const item = itemsData[itemId];
    const seedPrice = priceMap.get(itemId) ?? 0;
    if (seedPrice <= 0 || item.credValue <= 0) return [];
    return [{ itemId, name: item.name, seedPrice, credValue: item.credValue }];
  });

  // dp[s] = maximum credValue obtainable by spending exactly s seeds
  const dp = new Float64Array(seedBudget + 1);
  dp.fill(Number.NEGATIVE_INFINITY);
  dp[0] = 0;

  const previousSpent = new Int32Array(seedBudget + 1);
  previousSpent.fill(-1);

  const previousPart = new Int32Array(seedBudget + 1);
  previousPart.fill(-1);

  for (let spent = 1; spent <= seedBudget; spent++) {
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const previous = spent - part.seedPrice;

      if (previous < 0 || !Number.isFinite(dp[previous])) continue;

      const candidate = dp[previous] + part.credValue;
      if (candidate > dp[spent]) {
        dp[spent] = candidate;
        previousSpent[spent] = previous;
        previousPart[spent] = i;
      }
    }
  }

  // Find the best result without exceeding the budget
  let bestSpent = 0;

  for (let spent = 1; spent <= seedBudget; spent++) {
    if (dp[spent] > dp[bestSpent]) bestSpent = spent;
  }

  // Reconstruct the purchased Arc Parts
  const quantities = new Map<Item["id"], number>();
  let cursor = bestSpent;

  while (cursor > 0 && previousPart[cursor] !== -1) {
    const partIndex = previousPart[cursor];
    const part = parts[partIndex];
    quantities.set(part.itemId, (quantities.get(part.itemId) ?? 0) + 1);
    cursor = previousSpent[cursor];
  }

  const arcParts: ArcPartResult[] = parts
    .filter((part) => (quantities.get(part.itemId) ?? 0) > 0)
    .map((part) => {
      const quantity = quantities.get(part.itemId)!;
      return { ...part, quantity, totalCredValue: quantity * part.credValue };
    });

  const totalCredValue = existingCredValue + arcParts.reduce((acc, part) => acc + part.totalCredValue, 0);

  // Each offer represents a complete bundle
  const traderOptions: TraderOption[] = traderItems.map((offer) => {
    const item = itemsData[offer.itemId];
    const affordableBundles = offer.bundlePrice > 0 ? Math.floor(totalCredValue / offer.bundlePrice) : 0;

    return {
      itemId: offer.itemId,
      name: item.name,
      quantityPerBundle: offer.quantityPerBundle,
      bundlePrice: offer.bundlePrice,
      affordableBundles,
      totalQuantity: affordableBundles * offer.quantity,
      remainingCredValue: totalCredValue - affordableBundles * offer.bundlePrice
    };
  });

  return {
    inventorySeedValue,
    remainingSeeds: seedBudget - bestSpent,
    arcParts,
    totalCredValue,
    traderOptions,
    unpricedItems
  };
}
