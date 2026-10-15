import { ARC_PART_IDS } from "@/constants/items";
import { getItemData } from "@/store/items";
import type { SeedExchangeParams, SeedExchangeResult } from "@/types/barter";

export function calculateSeedExchange({ inventory, prices }: SeedExchangeParams): SeedExchangeResult {
  const priceMap = new Map(prices.map(({ itemId, price }) => [itemId, price]));

  const items: SeedExchangeResult["items"] = [];

  let existingSeeds = 0;
  let totalSeedValue = 0;

  for (const { itemId, quantity } of inventory) {
    if (quantity <= 0) continue;

    if (itemId === "assorted-seeds") {
      existingSeeds += quantity;
      continue;
    }

    // Existing Arc Parts are reserved for Nomad Trader
    if (ARC_PART_IDS.includes(itemId)) continue;

    const price = priceMap.get(itemId) ?? 0;
    if (price <= 0) continue;

    const { name } = getItemData(itemId);
    const itemSeedValue = price * quantity;

    items.push({
      itemId,
      name,
      quantity,
      seedPrice: price,
      totalSeedValue: itemSeedValue
    });

    totalSeedValue += itemSeedValue;
  }

  const availableSeeds = Math.floor(existingSeeds + totalSeedValue);

  return {
    existingSeeds,
    items,
    totalSeedValue,
    availableSeeds
  };
}
