<template>
  <item-card :id="item.itemId" :icon="item.icon" :title="item.title" :rarity="item.rarity">
    <div>{{ item.price }} cred</div>
    <div>Affordable: {{ item.affordableBundles }}</div>
  </item-card>
</template>
<script setup lang="ts">
import type { TraderOption } from "@/types/barter";
import ItemCard from "./item-card.vue";

interface Props {
  item: TraderOption
}
defineProps<Props>();
</script>
