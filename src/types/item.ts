import type { MetaForgeItem, MetaForgeTraderOffer, MetaForgeTraderService } from "./api";

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
export type StockEntry = InventoryEntry & PriceEntry;
export interface NomadTraderOffer {
  itemId: string
  title: MetaForgeTraderOffer["offer_title"]
  rarity: MetaForgeItem["rarity"]
  icon: MetaForgeItem["icon"]
  price: number
}
export interface NomadTraderService {
  id: MetaForgeTraderService["id"]
  name: MetaForgeTraderService["name"]
  price: number
}
