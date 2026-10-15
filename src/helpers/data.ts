import itemsData from "../data/items.json" with { type: "json" };
import type { MetaForgeItem } from "@/types/api";

export function getItemData(id: MetaForgeItem["id"]) {
  return itemsData[id];
}
