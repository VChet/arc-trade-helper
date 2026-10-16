<template>
  <item-card
    :id="data.id"
    class="stock-card"
    :icon="data.icon"
    :title="data.name"
    :rarity="data.rarity"
    :class="{ unavailable: !quantity }"
    clickable
  >
    <div class="market-field">
      <icon-packages />
      <input
        v-model="quantity"
        :name="`quantity-${item.itemId}`"
        type="number"
        min="0"
        :max="item.itemId === SEEDS_ID ? 30_000 : 300"
        step="1"
      >
    </div>
    <div v-if="item.itemId !== SEEDS_ID" class="market-field">
      <icon-seedling />
      <input
        v-model="price"
        :name="`price-${item.itemId}`"
        type="number"
        min="0"
        max="500"
        step="1"
        :class="{ highlight }"
      >
    </div>
    <div v-if="recommendedPrice.price" class="recommended-price" :class="`confidence-${recommendedPrice.confidence}`">
      <icon-chart-histogram />
      {{ recommendedPrice.price }}
    </div>
  </item-card>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { IconChartHistogram, IconPackages, IconSeedling } from "@tabler/icons-vue";
import { SEEDS_ID } from "@/constants/items";
import { getItemData } from "@/helpers/data";
import { calculateRecommendedPrice, type RecommendedPrice } from "@/helpers/recommended-price";
import { fetchPriceHistory } from "@/services/meta-forge";
import type { StockEntry } from "@/types/item";
import ItemCard from "./item-card.vue";

interface Props {
  item: StockEntry
}
interface Emits {
  quantity: [quantity: StockEntry["quantity"]]
  price: [price: StockEntry["price"]]
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const data = getItemData(props.item.itemId);

const quantity = ref<StockEntry["quantity"]>(props.item.quantity);
const price = ref<StockEntry["price"]>(props.item.price);
const recommendedPrice = ref<RecommendedPrice>({ price: null, confidence: "low" });
const highlight = computed<boolean>(() => {
  if (!price.value || !recommendedPrice.value.price) return false;
  const isTooLow = price.value < recommendedPrice.value.price / 2;
  const isTooHigh = price.value > recommendedPrice.value.price * 2;
  return isTooLow || isTooHigh;
}
);
watchDebounced(quantity, (value) => emit("quantity", value!), { debounce: 500 });
watchDebounced(price, (value) => emit("price", value), { debounce: 500 });

onMounted(async () => {
  if (props.item.itemId === SEEDS_ID) return;
  const priceHistory = await fetchPriceHistory(props.item.itemId);
  recommendedPrice.value = calculateRecommendedPrice(priceHistory);
  if (recommendedPrice.value.price && !price.value) price.value = recommendedPrice.value.price!;
});
</script>
<style>
.stock-card {
  &.unavailable:not(:focus-within, :hover) {
    opacity: 0.5;
  }
  .market-field {
    padding: 0 0 0 0.5rem;
  }
  .highlight {
    color: #ffd43b;
  }
  .recommended-price {
    &.confidence-low {
      color: #ff6b6b;
    }
    &.confidence-medium {
      color: #ffd43b;
    }
    &.confidence-high {
      color: #51cf66;
    }
  }
  input {
    text-align: center;
    border: none;
  }
}
</style>
