<template>
  <main class="main-container">
    <h2>Market Prices</h2>
    <ul class="grid">
      <priced-item
        v-for="item in priceItems"
        :key="item.itemId"
        :item
        @price="setPrice(item.itemId, $event)"
      />
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
      <div>
        Seed Value: {{ barterPlan.inventorySeedValue }}
      </div>
      <div>
        Cred Value: {{ barterPlan.totalCredValue }}
      </div>
    </section>

    <h2>Barter Plan</h2>
    <ul v-if="barterPlan.arcParts.length" class="grid">
      <trade-item v-for="item in barterPlan.arcParts" :key="item.itemId" :item />
    </ul>
    <section>
      <div>
        Remaining Seeds: {{ barterPlan.remainingSeeds }}
      </div>
      <div v-if="barterPlan.unpricedItems.length">
        Unpriced Items: {{ barterPlan.unpricedItems }}
      </div>
    </section>

    <h2>Nomad Trader</h2>
    <ul class="grid">
      <trader-item v-for="item in barterPlan.traderOptions" :key="item.itemId" :item />
    </ul>
  </main>
</template>
<script setup lang="ts">
import { useItemsStore } from "@/store/items";
import type { Item } from "@/types/item";
import InventoryItem from "./inventory-item.vue";
import PricedItem from "./priced-item.vue";
import TradeItem from "./trade-item.vue";
import TraderItem from "./trader-item.vue";

const { prices, inventory, barterPlan } = useItemsStore();
const priceItems = prices.value.filter(({ itemId }) => !["assorted-seeds", "raider-tokens"].includes(itemId));
const inventoryItems = inventory.value.filter(({ itemId }) => !["raider-tokens"].includes(itemId));

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
  gap: 1.5rem;
  margin-top: 1.5rem;
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    gap: 1rem;
    .item-card {
      --rarity-color: #6c6c6c;
      display: grid;
      overflow: hidden;
      font-size: 0.875rem;
      border: 1px solid var(--base-dimmed);
      border-radius: var(--radius);
      transition: border-color 0.3s;
      &:hover,
      &:focus-within {
        border-color: var(--base);
      }
      &.uncommon {
        --rarity-color: #26bf57;
      }
      &.rare {
        --rarity-color: #00a8f2;
      }
      &.epic {
        --rarity-color: #cc3099;
      }
      &.legendary {
        --rarity-color: #ffc600;
      }
      &.amplified {
        --rarity-color: #e78728;
      }
      header {
        display: grid;
        place-items: center;
        background:
          linear-gradient(
            20deg,
            color-mix(in srgb, var(--rarity-color), transparent 0%) 0%,
            color-mix(in srgb, var(--rarity-color), transparent 75%) 100%
          );
        img {
          width: 4.5rem;
          height: 4.5rem;
        }
      }
      section {
        padding: 0.5rem 1rem;
        h3 {
          text-align: center;
        }
        .row {
          display: flex;
          align-items: baseline;
        }
      }
      footer {
        display: flex;
        justify-content: space-between;
        padding-block: 0.5rem;
        margin-top: auto;
        div {
          flex: 1;
          text-align: center;
        }
      }
    }
  }
}
</style>
