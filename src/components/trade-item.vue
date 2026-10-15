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
        <div v-if="'totalSeedValue' in item">
          {{ item.totalSeedValue }} seeds
        </div>
        <div v-if="'totalCredValue' in item">
          {{ item.totalCredValue }} cred
        </div>
        <template v-if="'slots' in item">
          <div>
            Slots: {{ item.slots }}
          </div>
          <div>
            Weight: {{ formatWeight(item.weight) }}
          </div>
        </template>
      </footer>
    </section>
  </li>
</template>
<script setup lang="ts">
import { getItemData } from "@/helpers/data";
import { formatWeight } from "@/helpers/format";
import type { ArcPartResult, ExchangeItem, RaidItem } from "@/types/barter";

interface Props {
  item: ArcPartResult | ExchangeItem | RaidItem
}
const props = defineProps<Props>();

const data = getItemData(props.item.itemId);
</script>
