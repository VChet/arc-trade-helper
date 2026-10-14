import type { MetaForgeItem } from "./api";

export interface Item {
  id: MetaForgeItem["id"]
  name: MetaForgeItem["name"]
  rarity: MetaForgeItem["rarity"]
  icon: MetaForgeItem["icon"]
  stackSize: MetaForgeItem["stat_block"]["stackSize"]
  weight: MetaForgeItem["stat_block"]["weight"]
  credValue: MetaForgeItem["value"]
}
export interface PriceEntry {
  itemId: MetaForgeItem["id"]
  price: number
}
export interface InventoryEntry {
  itemId: MetaForgeItem["id"]
  quantity: number
}
export interface NomadTraderEntry {
  itemId: MetaForgeItem["id"]
  quantity: number
  quantityPerBundle: number
  bundlePrice: number
}
