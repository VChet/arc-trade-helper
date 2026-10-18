import { SEEDS_ID } from "@/constants/items";
import { normalizeCapacity } from "@/helpers/capacity";
import { getItemData } from "@/helpers/data";
import type { Raid, RaidItem, RaidsResult, TradeSide } from "@/types/barter";
import type { Item } from "@/types/item";

interface RaidInputItem {
  itemId: Item["id"]
  quantity: number
  seedPrice: number
}

function addItem(side: TradeSide, item: RaidItem, stackSize: number) {
  const existingItem = side.items.find(({ itemId }) => itemId === item.itemId);
  if (existingItem) {
    const previousSlots = existingItem.slots;
    existingItem.quantity += item.quantity;
    existingItem.weight += item.weight;
    existingItem.slots = Math.ceil(existingItem.quantity / stackSize);
    side.usedSlots += existingItem.slots - previousSlots;
  } else {
    side.items.push(item);
    side.usedSlots += item.slots;
  }
  side.totalWeight += item.weight;
}

function calculateRaids(entries: RaidInputItem[], capacity: number, exchangeType: "to-seeds" | "from-seeds"): Raid[] {
  const raids: Raid[] = [];
  const augmentCapacity = normalizeCapacity(capacity);
  const seed = getItemData(SEEDS_ID);
  const seedsKey = exchangeType === "to-seeds" ? "receive" : "give";
  const itemsKey = exchangeType === "to-seeds" ? "give" : "receive";

  function createRaid(): Raid {
    return {
      give: { items: [], usedSlots: 0, totalWeight: 0 },
      receive: { items: [], usedSlots: 0, totalWeight: 0 },
      capacity: augmentCapacity
    };
  }

  let currentRaid = createRaid();

  for (const { itemId, quantity, seedPrice } of entries) {
    if (quantity <= 0) continue;

    const { name, weight, stackSize } = getItemData(itemId);
    if (weight < 0 || stackSize <= 0) throw new RangeError(`Invalid weight or stackSize for ${itemId}`);

    let remaining = quantity;

    while (remaining > 0) {
      const itemSide = currentRaid[itemsKey];
      const seedSide = currentRaid[seedsKey];
      const availableItemSlots = augmentCapacity - itemSide.usedSlots;
      const currentSeedQuantity = seedSide.items.find((item) => item.itemId === seed.id)?.quantity ?? 0;
      const availableSeedQuantity = augmentCapacity * seed.stackSize - currentSeedQuantity;
      const quantityBySeeds = seedPrice > 0 ? Math.floor(availableSeedQuantity / seedPrice) : remaining;

      if (quantityBySeeds <= 0) {
        if (!itemSide.usedSlots && !seedSide.usedSlots) {
          throw new RangeError(`Seed price for ${itemId} exceeds the raid capacity`);
        }
        raids.push(currentRaid);
        currentRaid = createRaid();
        continue;
      }

      if (!availableItemSlots) {
        raids.push(currentRaid);
        currentRaid = createRaid();
        continue;
      }

      const requiredSlots = Math.ceil(remaining / stackSize);
      const slotsToAdd = Math.min(availableItemSlots, requiredSlots);
      const quantityToAdd = Math.min(remaining, slotsToAdd * stackSize, quantityBySeeds);
      const slotsUsed = Math.ceil(quantityToAdd / stackSize);
      const itemWeight = quantityToAdd * weight;

      addItem(itemSide, {
        itemId,
        name,
        quantity: quantityToAdd,
        weight: itemWeight,
        slots: slotsUsed
      }, stackSize);

      const seedQuantity = quantityToAdd * seedPrice;
      if (seedQuantity > 0) {
        addItem(seedSide, {
          itemId: SEEDS_ID,
          name: seed.name,
          quantity: seedQuantity,
          weight: seedQuantity * seed.weight,
          slots: Math.ceil(seedQuantity / seed.stackSize)
        }, seed.stackSize);
      }

      remaining -= quantityToAdd;
    }
  }

  if (currentRaid.give.usedSlots > 0 || currentRaid.receive.usedSlots > 0) raids.push(currentRaid);

  return raids;
}

interface CalculateRaidsParams {
  seedExchangeItems: RaidInputItem[]
  partsExchangeItems: RaidInputItem[]
  capacity: number
}

export function calculateRaidPlan({ seedExchangeItems, partsExchangeItems, capacity }: CalculateRaidsParams): RaidsResult {
  const seedExchange = calculateRaids(seedExchangeItems, capacity, "to-seeds");
  const partsExchange = calculateRaids(partsExchangeItems, capacity, "from-seeds");

  return {
    seedExchange,
    partsExchange
  };
}
