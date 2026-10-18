<template>
  <main class="main-container">
    <div class="links">
      <a href="https://metaforge.app/arc-raiders/market/my-listings" target="_blank">
        <icon-package />
        My Listings
      </a>
      <a href="https://metaforge.app/arc-raiders/market/messages" target="_blank">
        <icon-message-circle />
        Messages
      </a>
    </div>

    <h2>Stock and Market Prices</h2>
    <p>
      Enter the quantity of each item you have in the first field.<br>
      In the second field, enter your preferred price or use the recommended price from the third row.<br>
      The recommendation's color indicates confidence based on the number of recent trades and price variability.
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
      <input
        v-model.number="augmentCapacity"
        name="inventory-capacity"
        type="number"
        :min="CAPACITY.min"
        :max="CAPACITY.max"
        step="1"
      >
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

        <p class="summary">
          <icon-seedling-off />
          Seeds spent: {{ barterPlan.partsExchange.spentSeeds }}
        </p>
        <p class="summary">
          <icon-seedling />
          Seeds remaining: {{ barterPlan.partsExchange.remainingSeeds }}
        </p>
      </template>

      <p v-else>
        No Arc Parts to purchase
      </p>
    </section>

    <section>
      <h2>Nomad Trader</h2>

      <p class="summary">
        <icon-drone />
        Arc Parts value: {{ barterPlan.partsExchange.totalCredValue }} cred
      </p>

      <h3>Offers</h3>
      <ul class="grid">
        <trader-card
          v-for="item in traderItems"
          :key="item.itemId"
          :item
          :cred-value="barterPlan.partsExchange.totalCredValue"
        />
      </ul>

      <h3>Services</h3>
      <ul class="grid">
        <service-card
          v-for="service in traderServices"
          :key="service.id"
          :service
          :cred-value="barterPlan.partsExchange.totalCredValue"
        />
      </ul>
    </section>
  </main>
</template>
<script setup lang="ts">
import {
  IconDrone,
  IconLayoutGrid,
  IconMessageCircle,
  IconPackage,
  IconSeedling,
  IconSeedlingOff
} from "@tabler/icons-vue";
import { ITEM_IDS, TOKENS_ID } from "@/constants/items";
import { CAPACITY } from "@/helpers/capacity";
import { useItemsStore } from "@/store/items";
import traderItems from "../data/nomad-trader-offers.json" with { type: "json" };
import traderServices from "../data/nomad-trader-services.json" with { type: "json" };
import type { Item } from "@/types/item";
import ServiceCard from "./cards/service-card.vue";
import StockCard from "./cards/stock-card.vue";
import TradeCard from "./cards/trade-card.vue";
import TraderCard from "./cards/trader-card.vue";
import RaidList from "./raid-list.vue";

const { prices, inventory, augmentCapacity, barterPlan } = useItemsStore();
const priceMap = new Map(prices.value.map((item) => [item.itemId, item]));
const itemRows = inventory.value
  .filter(({ itemId }) => itemId !== TOKENS_ID && ITEM_IDS.includes(itemId))
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
  .links {
    display: flex;
    gap: 0.5rem;
    a {
      padding: 0.5rem 0.75rem;
      background: var(--card);
      border: 1px solid var(--base-dimmed);
      border-radius: var(--radius);
      &:hover, &:focus-visible {
        text-decoration: none;
        background: var(--base-dimmed);
      }
    }
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(13.5rem, 1fr));
    gap: 0.75rem;
  }
  .capacity-control {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    justify-self: start;
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
