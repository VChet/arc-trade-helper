<template>
  <li class="item-card" :class="data.rarity.toLowerCase()">
    <header @click="goToMarket">
      <img :src="data.icon">
      <h3>
        {{ data.name }}
        <arrow-square-out class="icon" />
      </h3>
    </header>
    <section>
      <div class="row">
        <input v-model="price" type="number">
        seeds
      </div>
    </section>
  </li>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { getItemData } from "@/helpers/data";
import type { PriceEntry } from "@/types/item";
import ArrowSquareOut from "./icons/arrow-square-out.vue";

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
  header {
    position: relative;
    cursor: pointer;
  }
  .icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 1rem;
    height: 1rem;
    margin: 0.25rem;
  }
}
</style>
