<template>
  <section class="raid-list">
    <div v-if="raids.length" class="raid-cards">
      <raid-card v-for="(raid, index) in raids" :key="index" :raid :index />
    </div>
    <p v-else>
      No raids needed
    </p>
  </section>
</template>
<script setup lang="ts">
import type { Raid } from "@/types/barter";
import RaidCard from "./raid-card.vue";

interface Props {
  raids: Raid[]
}
defineProps<Props>();
</script>
<style>
.raid-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.raid-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block: 1rem;
}
</style>
