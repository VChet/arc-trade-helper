<template>
  <section class="trade-side">
    <h5>{{ title }}</h5>
    <div v-if="side.items.length > 1" class="summary">
      <span>
        <icon-layout-grid title="slots" /> {{ side.usedSlots }}/{{ capacity }}
      </span>
      <span>
        <icon-weight title="weight" /> {{ formatWeight(side.totalWeight) }}
      </span>
    </div>
    <ul class="grid">
      <trade-card v-for="item in side.items" :key="item.itemId" :item />
    </ul>
  </section>
</template>
<script setup lang="ts">
import { IconLayoutGrid, IconWeight } from "@tabler/icons-vue";
import { formatWeight } from "@/helpers/format";
import type { TradeSide } from "@/types/barter";
import TradeCard from "./cards/trade-card.vue";

interface Props {
  title: string
  side: TradeSide
  capacity: number
}
defineProps<Props>();
</script>
