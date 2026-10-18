import { calculatePartsExchange } from "@/services/barter/parts-exchange";
import { calculateRaidPlan } from "@/services/barter/raids";
import { calculateSeedExchange } from "@/services/barter/seed-exchange";
import type { BarterPlan } from "@/types/barter";
import type { InventoryEntry, NomadTraderEntry, PriceEntry } from "@/types/item";

interface CalculateBarterParams {
  inventory: InventoryEntry[]
  prices: PriceEntry[]
  traderItems: NomadTraderEntry[]
  augmentCapacity: number
}

export function calculateBarter({ inventory, prices, traderItems, augmentCapacity }: CalculateBarterParams): BarterPlan {
  // Stage 1: exchange regular items for seeds
  const seedExchange = calculateSeedExchange({ inventory, prices });
  // Stage 2: use the available seed budget to buy Arc Parts
  const partsExchange = calculatePartsExchange({
    inventory,
    prices,
    seedBudget: seedExchange.availableSeeds,
    traderItems
  });
  // Stage 3: calculate raid capacity and weight
  const raids = calculateRaidPlan({
    seedExchangeItems: seedExchange.items,
    partsExchangeItems: partsExchange.arcParts,
    capacity: augmentCapacity
  });

  return {
    seedExchange,
    partsExchange,
    raids
  };
}
