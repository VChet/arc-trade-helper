<template>
  <li class="item-card" :class="data.rarity.toLowerCase()">
    <header>
      <img :src="data.icon">
    </header>
    <section>
      <h3>
        {{ item.name }} x{{ item.quantityPerBundle }}
      </h3>
    </section>
    <footer>
      <div>{{ item.bundlePrice }} cred</div>
      <div>Affordable: {{ item.affordableBundles }}</div>
    </footer>
  </li>
</template>
<script setup lang="ts">
import { getItemData } from "@/store/items";
import type { TraderOption } from "@/types/barter";

interface Props {
  item: TraderOption
}
const props = defineProps<Props>();

const data = getItemData(props.item.itemId);
</script>
