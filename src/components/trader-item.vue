<template>
  <li class="item-card" :class="item.rarity.toLowerCase()">
    <header>
      <img :src="item.icon">
      <h3>
        {{ item.title }}
      </h3>
    </header>
    <footer>
      <div>{{ item.price }} cred</div>
      <div>Affordable: {{ item.affordableBundles }}</div>
    </footer>
  </li>
</template>
<script setup lang="ts">
import type { TraderOption } from "@/types/barter";

interface Props {
  item: TraderOption
}
const props = defineProps<Props>();
</script>
