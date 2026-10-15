<template>
  <main class="main-container">
    <h2>Market Prices</h2>
    <ul class="grid">
      <market-item v-for="item in priceItems" :key="item.itemId" :item @price="setPrice(item.itemId, $event)" />
    </ul>

    <h2>Inventory</h2>
    <ul class="grid">
      <inventory-item
        v-for="item in inventoryItems"
        :key="item.itemId"
        :item
        @quantity="setQuantity(item.itemId, $event)"
      />
    </ul>

    <section>
      <h2>Exchange Items to Seeds</h2>

      <template v-if="barterPlan.seedExchange.items.length">
        <ul class="grid">
          <trade-item v-for="item in barterPlan.seedExchange.items" :key="item.itemId" :item />
        </ul>

        <raid-list :raids="barterPlan.raids.seedExchange" />

        <div class="summary">
          <icon-seedling />
          Seeds after exchange: {{ barterPlan.seedExchange.availableSeeds }}
        </div>
      </template>

      <p v-else class="summary">
        No items to exchange for seeds
      </p>
    </section>

    <section>
      <h2>Exchange Seeds to Arc Parts</h2>

      <template v-if="barterPlan.partsExchange.arcParts.length">
        <ul class="grid">
          <trade-item v-for="item in barterPlan.partsExchange.arcParts" :key="item.itemId" :item />
        </ul>

        <raid-list :raids="barterPlan.raids.partsExchange" />

        <div class="summary">
          <div>
            <icon-seedling-off />
            Seeds spent: {{ barterPlan.partsExchange.spentSeeds }}
          </div>
          <div>
            <icon-seedling />
            Seeds remaining: {{ barterPlan.partsExchange.remainingSeeds }}
          </div>
          <div>
            <icon-drone />
            Arc Parts value: {{ barterPlan.partsExchange.totalCredValue }} cred
          </div>
        </div>
      </template>

      <p v-else class="summary">
        No Arc Parts to purchase
      </p>
    </section>

    <section>
      <h2>Nomad Trader</h2>

      <ul class="grid">
        <trader-item v-for="item in barterPlan.partsExchange.traderOptions" :key="item.itemId" :item />
      </ul>
    </section>
  </main>
</template>
<script setup lang="ts">
import { IconDrone, IconSeedling, IconSeedlingOff } from "@tabler/icons-vue";
import { ITEM_IDS } from "@/constants/items";
import { useItemsStore } from "@/store/items";
import type { Item } from "@/types/item";
import InventoryItem from "./inventory-item.vue";
import MarketItem from "./market-item.vue";
import RaidList from "./raid-list.vue";
import TradeItem from "./trade-item.vue";
import TraderItem from "./trader-item.vue";

const { prices, inventory, barterPlan } = useItemsStore();
const priceItems = prices.value.filter(({ itemId }) => !["assorted-seeds", "raider-tokens"].includes(itemId) && ITEM_IDS.includes(itemId));
const inventoryItems = inventory.value.filter(({ itemId }) => !["raider-tokens"].includes(itemId) && ITEM_IDS.includes(itemId));

function setPrice(id: Item["id"], price: number) {
  const item = prices.value.find(({ itemId }) => itemId === id);
  if (item) item.price = price;
}
function setQuantity(id: Item["id"], quantity: number) {
  const item = inventory.value.find(({ itemId }) => itemId === id);
  if (item) item.quantity = quantity;
}
</script>
<style>
@import url("../assets/card.css");
.main-container {
  display: grid;
  margin-top: 1.5rem;
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 0.75rem;
  }
  .summary {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-block: 0.5rem;
    > * {
      display: flex;
      gap: 0.125rem;
      align-items: center;
    }
  }
}
</style>
