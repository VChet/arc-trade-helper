<template>
  <li class="item-card" :class="data.rarity.toLowerCase()">
    <header>
      <img :src="data.icon">
      <h3>
        {{ data.name }}
      </h3>
    </header>
    <section>
      <div class="row">
        <input v-model="quantity" type="number">
      </div>
    </section>
  </li>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { getItemData } from "@/store/items";
import type { InventoryEntry } from "@/types/item";

interface Props {
  item: InventoryEntry
}
interface Emits {
  quantity: [quantity: number]
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const data = getItemData(props.item.itemId);

const quantity = ref(props.item.quantity);
watchDebounced(quantity, (value) => emit("quantity", value!), { debounce: 500 });
</script>
