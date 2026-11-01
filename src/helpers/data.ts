import itemsData from "../data/items.json" with { type: "json" };
import type { MetaForgeItem } from "@/types/api";
import type { Item } from "@/types/item";

export function getItemData(id: MetaForgeItem["id"]): Item {
  return { ...itemsData[id], id };
}
