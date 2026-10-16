import type { InventoryEntry, Item, NomadTraderEntry, PriceEntry } from "@/types/item";

export interface ExchangeItem {
  itemId: Item["id"]
  name: string
  quantity: number
  seedPrice: number
  totalSeedValue?: number
}

export interface ArcPartResult {
  itemId: Item["id"]
  name: string
  quantity: number
  seedPrice: number
  credValue: number
  totalCredValue: number
}

export interface TraderOption extends NomadTraderEntry {
  affordableBundles: number
}

export interface SeedExchangeResult {
  existingSeeds: number
  items: ExchangeItem[]
  totalSeedValue: number
  availableSeeds: number
}

export interface PartsExchangeResult {
  existingArcParts: ArcPartResult[]
  arcParts: ArcPartResult[]
  spentSeeds: number
  remainingSeeds: number
  totalCredValue: number
  traderOptions: TraderOption[]
}

export interface RaidItem {
  itemId: Item["id"]
  name: Item["name"]
  quantity: number
  weight: number
  slots: number
}

export interface Raid {
  items: RaidItem[]
  usedSlots: number
  totalWeight: number
  totalSeeds: number
  capacity: number
}

export interface RaidsResult {
  seedExchange: Raid[]
  partsExchange: Raid[]
}

export interface BarterPlan {
  seedExchange: SeedExchangeResult
  partsExchange: PartsExchangeResult
  raids: RaidsResult
}

export interface SeedExchangeParams {
  inventory: InventoryEntry[]
  prices: PriceEntry[]
}

export interface PartsExchangeParams {
  inventory: InventoryEntry[]
  prices: PriceEntry[]
  seedBudget: number
  traderItems: NomadTraderEntry[]
}
