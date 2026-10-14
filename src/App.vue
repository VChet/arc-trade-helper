<template>
  <header class="container">
    Item data provided by <a href="https://metaforge.app/arc-raiders">MetaForge</a>
  </header>
  <main-view class="container" />
</template>
<script setup lang="ts">
import MainView from "./components/main-view.vue";
</script>
<style>
header {
  padding-block: 0.5rem;
  border-bottom: 1px solid var(--base-dimmed);
}
</style>
