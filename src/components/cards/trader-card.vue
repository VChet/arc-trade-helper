<template>
  <item-card
    :id="item.itemId"
    :icon="item.icon"
    :title
    :rarity="item.rarity"
    :highlight="isAffordable"
    link="database"
  >
    <div>{{ formatCredValue(item.price) }}</div>
  </item-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { getItemData } from "@/helpers/data";
import { formatCredValue } from "@/helpers/format";
import type { MetaForgeItem } from "@/types/api";
import type { NomadTraderOffer } from "@/types/item";
import ItemCard from "./item-card.vue";

interface Props {
  item: NomadTraderOffer
  credValue: number
}
const props = defineProps<Props>();
const title = props.item.itemId.includes("cosmetic") ?
  getItemData(props.item.itemId as MetaForgeItem["id"]).name :
  props.item.title;
const isAffordable = computed<boolean>(() => props.credValue >= props.item.price);
</script>
