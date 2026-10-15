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
      <h2>Stage 1: Items to Seeds</h2>

      <template v-if="barterPlan.seedExchange.items.length">
        <ul class="grid">
          <trade-item v-for="item in barterPlan.seedExchange.items" :key="item.itemId" :item />
        </ul>

        <raid-list :raids="barterPlan.raids.seedExchange" />

        <div class="summary">
          Seeds after exchange: {{ barterPlan.seedExchange.availableSeeds }}
        </div>
      </template>

      <p v-else class="summary">
        No items to exchange for seeds
      </p>
    </section>

    <section>
      <h2>Stage 2: Seeds to Arc Parts</h2>

      <template v-if="barterPlan.partsExchange.arcParts.length">
        <ul class="grid">
          <trade-item v-for="item in barterPlan.partsExchange.arcParts" :key="item.itemId" :item />
        </ul>

        <raid-list :raids="barterPlan.raids.partsExchange" />

        <div class="summary">
          <div>
            Seeds spent: {{ barterPlan.partsExchange.spentSeeds }}
          </div>
          <div>
            Seeds remaining: {{ barterPlan.partsExchange.remainingSeeds }}
          </div>
          <div>
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
import { useItemsStore } from "@/store/items";
import type { Item } from "@/types/item";
import InventoryItem from "./inventory-item.vue";
import MarketItem from "./market-item.vue";
import RaidList from "./raid-list.vue";
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
  margin-top: 1.5rem;
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    gap: 0.75rem;
    .item-card {
      --rarity-color: #6c6c6c;
      display: grid;
      overflow: hidden;
      font-size: 0.875rem;
      background: var(--card-nested);
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
        grid-template-columns: min-content 1fr;
        place-items: center;
        background: linear-gradient(to right, var(--rarity-color), var(--card) 30%);
        border-bottom: 1px solid var(--base-dimmed);
        img {
          width: 3rem;
          height: 3rem;
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
        padding-block: 0.5rem;
        margin-top: auto;
        text-align: center;
      }
    }
  }
  .summary {
    margin-block: 0.5rem;
  }
}
</style>
