<template>
  <li class="item-card" :class="data.rarity.toLowerCase()" @click="goToMarket">
    <header>
      <img :src="data.icon">
      <h3>
        {{ data.name }}
      </h3>
    </header>
    <section>
      <div class="row">
        <input v-model="price" type="number" @click.stop>
        seeds
      </div>
    </section>
  </li>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { getItemData } from "@/store/items";
import type { PriceEntry } from "@/types/item";

interface Props {
  item: PriceEntry
}
interface Emits {
  price: [price: PriceEntry["price"]]
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const data = getItemData(props.item.itemId);

const price = ref(props.item.price);
watchDebounced(price, (value) => emit("price", value), { debounce: 500 });

function goToMarket() {
  window.open(
    `https://metaforge.app/arc-raiders/market?item_id=${props.item.itemId}`,
    "_blank",
    "noopener, noreferrer"
  );
}
</script>
<style scoped>
.item-card {
  cursor: pointer;
}
</style>
