import { normalizeInventoryCapacity } from "@/helpers/capacity";
import { getItemData } from "@/helpers/data";
import type { Raid, RaidItem, RaidsResult } from "@/types/barter";
import type { Item } from "@/types/item";

interface RaidInputItem {
  itemId: Item["id"]
  quantity: number
  seedPrice: number
}

function calculateRaids(entries: RaidInputItem[], capacity: number): Raid[] {
  const raids: Raid[] = [];
  const inventoryCapacity = normalizeInventoryCapacity(capacity);

  let currentRaid: Raid = { items: [], usedSlots: 0, totalWeight: 0, totalSeeds: 0, capacity: inventoryCapacity };

  for (const { itemId, quantity, seedPrice } of entries) {
    if (quantity <= 0) continue;

    const { weight, stackSize } = getItemData(itemId);
    if (weight < 0 || stackSize <= 0) throw new RangeError(`Invalid weight or stackSize for ${itemId}`);

    let remaining = quantity;

    while (remaining > 0) {
      if (currentRaid.usedSlots === inventoryCapacity) {
        raids.push(currentRaid);
        currentRaid = { items: [], usedSlots: 0, totalWeight: 0, totalSeeds: 0, capacity: inventoryCapacity };
      }

      const availableSlots = inventoryCapacity - currentRaid.usedSlots;
      const requiredSlots = Math.ceil(remaining / stackSize);
      const slotsToAdd = Math.min(availableSlots, requiredSlots);
      const quantityToAdd = Math.min(remaining, slotsToAdd * stackSize);
      const slotsUsed = Math.ceil(quantityToAdd / stackSize);
      const itemWeight = quantityToAdd * weight;

      const raidItem: RaidItem = {
        itemId,
        name: getItemData(itemId).name,
        quantity: quantityToAdd,
        weight: itemWeight,
        slots: slotsUsed
      };

      currentRaid.items.push(raidItem);
      currentRaid.usedSlots += slotsUsed;
      currentRaid.totalWeight += itemWeight;
      currentRaid.totalSeeds += quantityToAdd * seedPrice;

      remaining -= quantityToAdd;
    }
  }

  if (currentRaid.usedSlots > 0) raids.push(currentRaid);

  return raids;
}

interface CalculateRaidsParams {
  seedExchangeItems: RaidInputItem[]
  partsExchangeItems: RaidInputItem[]
  capacity: number
}

export function calculateRaidPlan({ seedExchangeItems, partsExchangeItems, capacity }: CalculateRaidsParams): RaidsResult {
  const seedExchange = calculateRaids(seedExchangeItems, capacity);
  const partsExchange = calculateRaids(partsExchangeItems, capacity);

  return {
    seedExchange,
    partsExchange
  };
}
