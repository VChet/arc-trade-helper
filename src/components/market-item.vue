<template>
  <li class="item-card" :class="data.rarity.toLowerCase()">
    <header @click="goToMarket">
      <img :src="data.icon">
      <h3>
        {{ data.name }}
        <icon-external-link class="icon" />
      </h3>
    </header>
    <section>
      <div class="row">
        <input v-model="price" type="number">
        <span>seeds</span>
      </div>
    </section>
  </li>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { IconExternalLink } from "@tabler/icons-vue";
import { getItemData } from "@/helpers/data";
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
  const url = new URL("https://metaforge.app/arc-raiders/market");
  url.searchParams.set("item_id", props.item.itemId);
  url.searchParams.set("trade_type", "seed");
  window.open(url, "_blank", "noopener, noreferrer");
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
    margin: 0.25rem;
  }
  input {
    text-align: center;
  }
}
</style>
