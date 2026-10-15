<template>
  <li class="item-card" :class="data.rarity.toLowerCase()">
    <header>
      <img :src="data.icon">
      <h3>
        {{ item.name }} x{{ item.quantity }}
      </h3>
    </header>
    <section>
      <footer>
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
          <icon-square-dashed title="slots" />
          {{ pluralize(item.slots, "slot") }}
        </div>
        <div v-if="'weight' in item">
          <icon-weight title="weight" /> {{ formatWeight(item.weight) }}
        </div>
      </footer>
    </section>
  </li>
</template>
<script setup lang="ts">
import { IconSeedling, IconSquareDashed, IconWeight } from "@tabler/icons-vue";
import { getItemData } from "@/helpers/data";
import { formatWeight, pluralize } from "@/helpers/format";
import type { ArcPartResult, ExchangeItem, RaidItem } from "@/types/barter";

interface Props {
  item: ArcPartResult | ExchangeItem | RaidItem
}
const props = defineProps<Props>();

const data = getItemData(props.item.itemId);
</script>
