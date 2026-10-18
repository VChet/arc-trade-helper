import itemsData from "../data/items.json" with { type: "json" };

interface MetaForgeResponse {
  success: boolean
  data: unknown
}

type ItemId = keyof typeof itemsData;
export interface MetaForgeItem {
  id: ItemId
  name: string
  rarity: string
  icon: string
  value: number
  stat_block: {
    [key: string]: number | string
    stackSize: number
    weight: number
  }
}
export interface MetaForgeItemsResponse extends MetaForgeResponse {
  data: MetaForgeItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

interface MetaForgeAcceptedItem {
  [key: string]: unknown
  id: string
}
export interface MetaForgeTraderOffer {
  id: string
  offer_title: string
  coin_cost: number
  accepted_items: MetaForgeAcceptedItem[]
  item: Pick<MetaForgeItem, "id" | "name" | "rarity" | "icon" | "value"> | null
}
export interface MetaForgeTraderService {
  id: string
  name: string
  coin_cost: number
  accepted_items: MetaForgeAcceptedItem[]
}
export interface MetaForgeTradersResponse extends MetaForgeResponse {
  ermal: {
    offers: MetaForgeTraderOffer[]
    permanent_services: MetaForgeTraderService[]
    synced_at: string
  }
}

export interface MetaForgeTradeInterval {
  time: number
  min_price: number
  max_price: number
  median_price: number
  trade_count: number
}
export interface MetaForgeTradeHistoryResponse {
  data: MetaForgeTradeInterval[]
}
