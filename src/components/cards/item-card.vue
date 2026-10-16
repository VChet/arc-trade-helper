<template>
  <li class="item-card" :class="[rarity.toLowerCase(), { 'is-clickable': clickable }]">
    <header @click="clickable && goToMarket()">
      <img :src="icon">
      <h3>
        {{ title }}
        <icon-external-link v-if="clickable" />
      </h3>
    </header>
    <footer v-if="slots.default">
      <slot />
    </footer>
  </li>
</template>
<script setup lang="ts">
import type { VNodeChild } from "vue";
import { IconExternalLink } from "@tabler/icons-vue";
import type { Item } from "@/types/item";

interface Props {
  rarity: Item["rarity"]
  icon: Item["icon"]
  title: string
  id: string
  clickable?: boolean
}
interface Slots {
  default?: () => VNodeChild
}
const props = withDefaults(defineProps<Props>(), { clickable: false });
const slots = defineSlots<Slots>();

function goToMarket() {
  const url = new URL("https://metaforge.app/arc-raiders/market");
  url.searchParams.set("item_id", props.id);
  url.searchParams.set("trade_type", "seed");
  window.open(url, "_blank", "noopener, noreferrer");
}
</script>
<style>
.item-card {
  --rarity-color: #6c6c6c;
  display: grid;
  overflow: hidden;
  font-size: 0.875rem;
  background: var(--card-nested);
  border: 1px solid var(--base-dimmed);
  border-radius: var(--radius);
  transition: border-color 0.3s;
  &:hover,
  &:focus-within {
    border-color: var(--base);
  }
  &.uncommon {
    --rarity-color: #26bf57;
  }
  &.rare {
    --rarity-color: #00a8f2;
  }
  &.epic {
    --rarity-color: #cc3099;
  }
  &.legendary {
    --rarity-color: #ffc600;
  }
  &.amplified {
    --rarity-color: #e78728;
  }
  header {
    position: relative;
    display: grid;
    grid-template-columns: min-content 1fr;
    place-items: center;
    background: linear-gradient(to right, var(--rarity-color), var(--card) 30%);
    border-bottom: 1px solid var(--base-dimmed);
    img {
      width: 3rem;
      height: 3rem;
    }
  }
  &.is-clickable header {
    cursor: pointer;
  }
  .header-actions {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    margin: 0.25rem;
  }
  footer {
    display: flex;
    div {
      display: flex;
      flex: 1;
      gap: 0.125rem;
      align-items: center;
      justify-content: center;
      padding-block: 0.5rem;
      &:not(:last-child) {
        border-right: 1px solid var(--base-dimmed);
      }
    }
  }
}
</style>
