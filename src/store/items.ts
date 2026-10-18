import { computed } from "vue";
import { createGlobalState, useLocalStorage } from "@vueuse/core";
import { CAPACITY, normalizeCapacity } from "@/helpers/capacity";
import { getTypedKeys } from "@/helpers/object";
import { calculateBarter } from "@/services/barter";
import itemsData from "../data/items.json" with { type: "json" };
import type { MetaForgeItem } from "@/types/api";
import type { InventoryEntry, PriceEntry } from "@/types/item";

interface ItemsStore {
  prices: PriceEntry[]
  inventory: InventoryEntry[]
  augmentCapacity: number
};
const DEFAULT_STORE: ItemsStore = {
  prices: getTypedKeys(itemsData).map((itemId) => ({ itemId, price: 0 })),
  inventory: getTypedKeys(itemsData).map((itemId) => ({ itemId, quantity: 0 })),
  augmentCapacity: CAPACITY.default
};

function syncEntries<T extends { itemId: MetaForgeItem["id"] }>(saved: T[], defaults: T[]): T[] {
  const savedById = new Map(saved.map((entry) => [entry.itemId, entry]));
  return defaults.map((entry) => ({ ...entry, ...savedById.get(entry.itemId) }));
}

export const useItemsStore = createGlobalState(() => {
  const storage = useLocalStorage<ItemsStore>("items", DEFAULT_STORE, { mergeDefaults: true });

  storage.value.prices = syncEntries(storage.value.prices, DEFAULT_STORE.prices);
  storage.value.inventory = syncEntries(storage.value.inventory, DEFAULT_STORE.inventory);

  const prices = computed({
    get: () => storage.value.prices,
    set: (data) => { storage.value.prices = data; }
  });
  const inventory = computed({
    get: () => storage.value.inventory,
    set: (data) => { storage.value.inventory = data; }
  });
  const augmentCapacity = computed({
    get: () => normalizeCapacity(storage.value.augmentCapacity),
    set: (data) => { storage.value.augmentCapacity = normalizeCapacity(data); }
  });

  const barterPlan = computed(() => calculateBarter({
    inventory: inventory.value,
    prices: prices.value,
    augmentCapacity: augmentCapacity.value
  }));

  return {
    prices,
    inventory,
    augmentCapacity,
    barterPlan
  };
});
