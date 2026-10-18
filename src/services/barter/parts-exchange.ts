import { ARC_PART_IDS } from "@/constants/items";
import { getItemData } from "@/helpers/data";
import type { ArcPartResult, PartsExchangeParams, PartsExchangeResult } from "@/types/barter";
import type { Item } from "@/types/item";

export function calculatePartsExchange({ inventory, prices, seedBudget }: PartsExchangeParams): PartsExchangeResult {
  const priceMap = new Map(prices.map(({ itemId, price }) => [itemId, price]));

  const existingArcParts: ArcPartResult[] = [];
  let existingCredValue = 0;

  for (const { itemId, quantity } of inventory) {
    if (quantity <= 0 || !ARC_PART_IDS.includes(itemId)) continue;

    const { name, credValue } = getItemData(itemId);
    const totalCredValue = credValue * quantity;

    existingArcParts.push({
      itemId,
      name,
      quantity,
      seedPrice: 0,
      credValue,
      totalCredValue
    });

    existingCredValue += totalCredValue;
  }

  const candidates = ARC_PART_IDS.flatMap((itemId) => {
    const { name, credValue } = getItemData(itemId);
    const seedPrice = priceMap.get(itemId) ?? 0;

    if (seedPrice <= 0 || credValue <= 0) return [];
    return [{ itemId, name, seedPrice, credValue }];
  });

  // dp[spent] = maximum credValue achievable by spending exactly `spent` seeds
  const dp = new Float64Array(seedBudget + 1);
  dp.fill(Number.NEGATIVE_INFINITY);
  dp[0] = 0;

  const previousSpent = new Int32Array(seedBudget + 1);
  previousSpent.fill(-1);

  const previousPart = new Int32Array(seedBudget + 1);
  previousPart.fill(-1);

  for (let spent = 1; spent <= seedBudget; spent++) {
    for (let i = 0; i < candidates.length; i++) {
      const part = candidates[i]!;
      const previous = spent - part.seedPrice;

      if (previous < 0 || !Number.isFinite(dp[previous])) continue;

      const candidateValue = dp[previous] + part.credValue;
      if (candidateValue > dp[spent]) {
        dp[spent] = candidateValue;
        previousSpent[spent] = previous;
        previousPart[spent] = i;
      }
    }
  }

  // Find the best value without exceeding the budget
  let bestSpent = 0;

  for (let spent = 1; spent <= seedBudget; spent++) {
    if (dp[spent] > dp[bestSpent]) bestSpent = spent;
  }

  // Reconstruct the selected purchases
  const quantities = new Map<Item["id"], number>();
  let cursor = bestSpent;

  while (cursor > 0 && previousPart[cursor] !== -1) {
    const partIndex = previousPart[cursor];
    const part = candidates[partIndex];

    quantities.set(part.itemId, (quantities.get(part.itemId) ?? 0) + 1);

    cursor = previousSpent[cursor];
  }

  const arcParts: ArcPartResult[] = candidates
    .filter((part) => (quantities.get(part.itemId) ?? 0) > 0)
    .map((part) => {
      const quantity = quantities.get(part.itemId)!;
      return { ...part, quantity, totalCredValue: quantity * part.credValue };
    });

  const purchasedCredValue = arcParts.reduce((acc, part) => acc + part.totalCredValue, 0);
  const totalCredValue = existingCredValue + purchasedCredValue;

  return {
    existingArcParts,
    arcParts,
    spentSeeds: bestSpent,
    remainingSeeds: seedBudget - bestSpent,
    totalCredValue
  };
}
