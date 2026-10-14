<template>
  <li class="item-card" :class="data.rarity.toLowerCase()">
    <header>
      <img :src="data.icon">
    </header>
    <section>
      <h3>
        {{ item.name }}
      </h3>
      <footer>
        <div>
          Buy {{ item.quantity }} for {{ item.seedPrice }} seeds each
        </div>
      </footer>
    </section>
  </li>
</template>
<script setup lang="ts">
import { useItemsStore } from "@/store/items";
import type { ArcPartResult } from "@/service/barter";

interface Props {
  item: ArcPartResult
}
const props = defineProps<Props>();

const { getItemData } = useItemsStore();
const data = getItemData(props.item.itemId);
</script>
