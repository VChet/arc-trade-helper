<template>
  <main class="main-container">
    <h2>Stock and Market Prices</h2>
    <p>
      Enter how many of each item you have in your inventory in the first field.
      Click an item's name to open its MetaForge Market page, check the market price, and enter it in the second field.
    </p>
    <ul class="grid">
      <stock-card
        v-for="item in itemRows"
        :key="item.itemId"
        :item
        @quantity="setQuantity(item.itemId, $event)"
        @price="setPrice(item.itemId, $event)"
      />
    </ul>
    <label class="capacity-control">
      <icon-layout-grid />
      Augment capacity:
      <input v-model.number="inventoryCapacity" type="number" :min="CAPACITY.min" :max="CAPACITY.max" step="1">
    </label>

    <section>
      <h2>Exchange Items to Seeds</h2>
      <p>
        Items with a market price are included in this estimate. Enter prices above to see how many seeds they are
        worth.
      </p>

      <template v-if="barterPlan.seedExchange.items.length">
        <ul class="grid">
          <trade-card v-for="item in barterPlan.seedExchange.items" :key="item.itemId" :item />
        </ul>

        <raid-list :raids="barterPlan.raids.seedExchange" />

        <p>
          <icon-seedling />
          Seeds after exchange: {{ barterPlan.seedExchange.availableSeeds }}
        </p>
      </template>

      <p v-else>
        No items to exchange for seeds
      </p>
    </section>

    <section>
      <h2>Exchange Seeds to Arc Parts</h2>
      <p>
        Arc Parts you can buy with your available seeds. The plan chooses the combination with
        the highest total value.
      </p>

      <template v-if="barterPlan.partsExchange.arcParts.length">
        <ul class="grid">
          <trade-card v-for="item in barterPlan.partsExchange.arcParts" :key="item.itemId" :item />
        </ul>

        <raid-list :raids="barterPlan.raids.partsExchange" />

        <p>
          <icon-seedling-off />
          Seeds spent: {{ barterPlan.partsExchange.spentSeeds }}
        </p>
        <p>
          <icon-seedling />
          Seeds remaining: {{ barterPlan.partsExchange.remainingSeeds }}
        </p>
        <p>
          <icon-drone />
          Arc Parts value: {{ barterPlan.partsExchange.totalCredValue }} cred
        </p>
      </template>

      <p v-else>
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
import { IconDrone, IconLayoutGrid, IconSeedling, IconSeedlingOff } from "@tabler/icons-vue";
import { ITEM_IDS } from "@/constants/items";
import { CAPACITY } from "@/helpers/capacity";
import { useItemsStore } from "@/store/items";
import type { Item } from "@/types/item";
import StockCard from "./cards/stock-card.vue";
import TradeCard from "./cards/trade-card.vue";
import TraderCard from "./cards/trader-card.vue";
import RaidList from "./raid-list.vue";

const { prices, inventory, inventoryCapacity, barterPlan } = useItemsStore();
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
  p {
    margin-block: 0.5rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 0.75rem;
  }
  .capacity-control {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    margin-block: 0.5rem;
    input {
      width: 3rem;
      text-align: center;
    }
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
