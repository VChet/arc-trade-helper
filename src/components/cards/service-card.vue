<template>
  <item-card :id="service.id" :title="service.name" :highlight="isAffordable">
    <div>{{ formatCredValue(service.price) }}</div>
  </item-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { formatCredValue } from "@/helpers/format";
import type { NomadTraderService } from "@/types/item";
import ItemCard from "./item-card.vue";

interface Props {
  service: NomadTraderService
  credValue: number
}
const props = defineProps<Props>();
const isAffordable = computed<boolean>(() => props.credValue >= props.service.price);
</script>
