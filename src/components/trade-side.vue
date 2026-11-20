<template>
  <section class="trade-side">
    <header>
      <h5>{{ title }}</h5>
      <div v-if="side.items.length > 1" class="summary slots">
        <span>
          <icon-layout-grid title="slots" /> {{ side.usedSlots }}/{{ capacity }}
        </span>
        <span>
          <icon-weight title="weight" /> {{ formatWeight(side.totalWeight) }}
        </span>
      </div>
    </header>
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
<style>
.trade-side {
  > header {
    display: inline-flex;
    gap: 1rem;
    align-items: baseline;
    .slots {
      font-size: 0.925rem;
      span {
        display: inline-flex;
        gap: 0.125rem;
        align-items: center;
      }
    }
  }
}
</style>
