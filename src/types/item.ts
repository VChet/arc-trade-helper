import type { MetaForgeItem, MetaForgeTraderOffer, MetaForgeTraderService } from "./api";

export interface Item {
  id: MetaForgeItem["id"]
  name: MetaForgeItem["name"]
  rarity: NonNullable<MetaForgeItem["rarity"]>
  icon: MetaForgeItem["icon"]
  stackSize: NonNullable<MetaForgeItem["stat_block"]["stackSize"]>
  weight: NonNullable<MetaForgeItem["stat_block"]["weight"]>
  credValue: NonNullable<MetaForgeItem["value"]>
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
  rarity: Item["rarity"]
  icon: Item["icon"]
  price: number
  expires: MetaForgeTraderOffer["offer_end"]
}
export interface NomadTraderService {
  id: MetaForgeTraderService["id"]
  name: MetaForgeTraderService["name"]
  price: number
}
