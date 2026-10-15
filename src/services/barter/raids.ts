import { getItemData } from "@/helpers/data";
import type { Raid, RaidItem, RaidsResult } from "@/types/barter";
import type { Item } from "@/types/item";

export const RAID_SLOTS = 20;

interface RaidInputItem {
  itemId: Item["id"]
  quantity: number
}

function calculateRaids(entries: RaidInputItem[]): Raid[] {
  const raids: Raid[] = [];

  let currentRaid: Raid = { items: [], usedSlots: 0, totalWeight: 0 };

  for (const { itemId, quantity } of entries) {
    if (quantity <= 0) continue;

    const { weight, stackSize } = getItemData(itemId);
    if (weight < 0 || stackSize <= 0) throw new RangeError(`Invalid weight or stackSize for ${itemId}`);

    let remaining = quantity;

    while (remaining > 0) {
      if (currentRaid.usedSlots === RAID_SLOTS) {
        raids.push(currentRaid);
        currentRaid = { items: [], usedSlots: 0, totalWeight: 0 };
      }

      const availableSlots = RAID_SLOTS - currentRaid.usedSlots;
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

      remaining -= quantityToAdd;
    }
  }

  if (currentRaid.usedSlots > 0) raids.push(currentRaid);

  return raids;
}

interface CalculateRaidsParams {
  seedExchangeItems: RaidInputItem[]
  partsExchangeItems: RaidInputItem[]
}

export function calculateRaidPlan({ seedExchangeItems, partsExchangeItems }: CalculateRaidsParams): RaidsResult {
  const seedExchange = calculateRaids(seedExchangeItems);
  const partsExchange = calculateRaids(partsExchangeItems);

  return {
    seedExchange,
    partsExchange
  };
}
