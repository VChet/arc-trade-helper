<template>
  <article class="raid-card">
    <h4>Raid {{ index + 1 }}</h4>

    <div class="trade-sides">
      <trade-side title="Give" :side="raid.give" :capacity="raid.capacity" />
      <trade-side title="Receive" :side="raid.receive" :capacity="raid.capacity" />
    </div>
  </article>
</template>
<script setup lang="ts">
import type { Raid } from "@/types/barter";
import TradeSide from "./trade-side.vue";

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
  .trade-sides {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    h5 {
      margin-block: 0.5rem;
      font-size: 1rem;
    }
  }
}
</style>
