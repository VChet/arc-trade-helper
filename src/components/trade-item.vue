<template>
  <li class="item-card" :class="data.rarity.toLowerCase()">
    <header>
      <img :src="data.icon">
    </header>
    <section>
      <h3>
        {{ item.name }} x{{ item.quantity }}
      </h3>
      <footer>
        <div v-if="'totalSeedValue' in item">
          {{ item.totalSeedValue }} seeds
        </div>
        <div v-if="'totalCredValue' in item">
          {{ item.totalCredValue }} cred
        </div>
        <div v-if="'slots' in item">
          {{ item.slots }} slots
          {{ formatWeight(item.weight) }}
        </div>
        <slot />
      </footer>
    </section>
  </li>
</template>
<script setup lang="ts">
import { formatWeight } from "@/helpers/format";
import { getItemData } from "@/store/items";
import type { ArcPartResult, ExchangeItem, RaidItem } from "@/types/barter";

interface Props {
  item: ArcPartResult | ExchangeItem | RaidItem
}
const props = defineProps<Props>();

const data = getItemData(props.item.itemId);
</script>
