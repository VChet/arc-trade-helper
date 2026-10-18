<template>
  <item-card :id="item.itemId" :icon="item.icon" :title="item.title" :rarity="item.rarity">
    <div>{{ item.price }} cred</div>
    <div>Affordable: {{ affordableBundles }}</div>
  </item-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { getAffordableBundles } from "@/helpers/affordable-bundles";
import type { NomadTraderOffer } from "@/types/item";
import ItemCard from "./item-card.vue";

interface Props {
  item: NomadTraderOffer
  credValue: number
}
const props = defineProps<Props>();
const affordableBundles = computed(() => getAffordableBundles(props.credValue, props.item.price));
</script>
