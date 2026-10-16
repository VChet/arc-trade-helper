<template>
  <item-card :id="data.id" :icon="data.icon" :title="`${item.name} x${item.quantity}`" :rarity="data.rarity">
    <div v-if="'totalSeedValue' in item && item.totalSeedValue">
      <icon-seedling />
      {{ pluralize(item.totalSeedValue, "seed") }}
    </div>
    <div v-if="'totalCredValue' in item && item.seedPrice > 0">
      <icon-seedling />
      {{ pluralize(item.seedPrice * item.quantity, "seed") }}
    </div>
    <div v-if="'totalCredValue' in item">
      {{ item.totalCredValue }} cred
    </div>
    <div v-if="'slots' in item">
      <icon-layout-grid />
      {{ pluralize(item.slots, "slot") }}
    </div>
    <div v-if="'weight' in item">
      <icon-weight /> {{ formatWeight(item.weight) }}
    </div>
  </item-card>
</template>
<script setup lang="ts">
import { IconLayoutGrid, IconSeedling, IconWeight } from "@tabler/icons-vue";
import { getItemData } from "@/helpers/data";
import { formatWeight, pluralize } from "@/helpers/format";
import type { ArcPartResult, ExchangeItem, RaidItem } from "@/types/barter";
import ItemCard from "./item-card.vue";

interface Props {
  item: ArcPartResult | ExchangeItem | RaidItem
}
const props = defineProps<Props>();

const data = getItemData(props.item.itemId);
</script>
