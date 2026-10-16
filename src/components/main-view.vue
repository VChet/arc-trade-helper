<template>
  <main class="main-container">
    <h2>Stock and Market Prices</h2>
    <ul class="grid">
      <stock-card
        v-for="item in itemRows"
        :key="item.itemId"
        :item
        @quantity="setQuantity(item.itemId, $event)"
        @price="setPrice(item.itemId, $event)"
      />
    </ul>

    <section>
      <h2>Exchange Items to Seeds</h2>

      <template v-if="barterPlan.seedExchange.items.length">
        <ul class="grid">
          <trade-card v-for="item in barterPlan.seedExchange.items" :key="item.itemId" :item />
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
          <trade-card v-for="item in barterPlan.partsExchange.arcParts" :key="item.itemId" :item />
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
        <trader-card v-for="item in barterPlan.partsExchange.traderOptions" :key="item.itemId" :item />
      </ul>
    </section>
  </main>
</template>
<script setup lang="ts">
import { IconDrone, IconSeedling, IconSeedlingOff } from "@tabler/icons-vue";
import { ITEM_IDS } from "@/constants/items";
import { useItemsStore } from "@/store/items";
import type { Item } from "@/types/item";
import StockCard from "./cards/stock-card.vue";
import TradeCard from "./cards/trade-card.vue";
import TraderCard from "./cards/trader-card.vue";
import RaidList from "./raid-list.vue";

const { prices, inventory, barterPlan } = useItemsStore();
const priceMap = new Map(prices.value.map((item) => [item.itemId, item]));
const itemRows = inventory.value
  .filter(({ itemId }) => itemId !== "raider-tokens" && ITEM_IDS.includes(itemId))
  .map((inventoryItem) => {
    const priceItem = priceMap.get(inventoryItem.itemId);
    if (!priceItem) throw new Error(`Missing price entry for item "${inventoryItem.itemId}"`);
    return { ...inventoryItem, ...priceItem };
  });

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
