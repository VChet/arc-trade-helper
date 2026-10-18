<template>
  <item-card :id="service.id" :title="service.name">
    <div>{{ service.price }} cred</div>
    <div>Affordable: {{ affordableBundles }}</div>
  </item-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { getAffordableBundles } from "@/helpers/affordable-bundles";
import type { NomadTraderService } from "@/types/item";
import ItemCard from "./item-card.vue";

interface Props {
  service: NomadTraderService
  credValue: number
}
const props = defineProps<Props>();
const affordableBundles = computed(() => getAffordableBundles(props.credValue, props.service.price));
</script>
