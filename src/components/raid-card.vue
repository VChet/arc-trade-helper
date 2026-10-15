<template>
  <article class="raid-card">
    <h4>Raid {{ index + 1 }}</h4>

    <div class="summary">
      <div>
        <icon-square-dashed title="slots" /> {{ raid.usedSlots }}/{{ RAID_SLOTS }}
      </div>
      <div>
        <icon-weight title="weight" /> {{ formatWeight(raid.totalWeight) }}
      </div>
      <div>
        <icon-seedling title="seeds" /> {{ raid.totalSeeds }}
      </div>
    </div>

    <ul class="grid">
      <trade-item v-for="item in raid.items" :key="item.itemId" :item />
    </ul>
  </article>
</template>
<script setup lang="ts">
import { IconSeedling, IconSquareDashed, IconWeight } from "@tabler/icons-vue";
import { formatWeight } from "@/helpers/format";
import { RAID_SLOTS } from "@/services/barter/raids";
import type { Raid } from "@/types/barter";
import TradeItem from "./trade-item.vue";

interface Props {
  raid: Raid
  index: number
}
defineProps<Props>();
</script>
<style>
.raid-card {
  padding: 1rem;
  background: var(--card);
  border: 1px solid var(--base-dimmed);
  border-radius: var(--radius);
}
</style>
