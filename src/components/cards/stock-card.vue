<template>
  <item-card
    :id="data.id"
    class="stock-card"
    :icon="data.icon"
    :title="data.name"
    :rarity="data.rarity"
    clickable
  >
    <template #header-actions>
      <icon-external-link />
    </template>
    <div class="market-field">
      <icon-packages />
      <input v-model="quantity" type="number">
    </div>
    <div v-if="item.itemId !== 'assorted-seeds'" class="market-field">
      <icon-seedling />
      <input v-model="price" type="number">
    </div>
  </item-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { IconExternalLink, IconPackages, IconSeedling } from "@tabler/icons-vue";
import { getItemData } from "@/helpers/data";
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

const quantity = ref(props.item.quantity);
const price = ref(props.item.price);
watchDebounced(quantity, (value) => emit("quantity", value!), { debounce: 500 });
watchDebounced(price, (value) => emit("price", value), { debounce: 500 });
</script>
<style>
.stock-card {
  .market-field {
    padding: 0 0 0 0.5rem;
  }
  input {
    text-align: center;
    border: none;
  }
}
</style>
