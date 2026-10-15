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

export interface MetaForgeTraderOffer {
  id: string
  offer_title: string
  coin_cost: number
  accepted_items: {
    [key: string]: unknown
    id: string
  }[]
  item: Pick<MetaForgeItem, "id" | "name" | "rarity" | "icon" | "value"> | null
}
export interface MetaForgeTradersResponse extends MetaForgeResponse {
  ermal: {
    offers: MetaForgeTraderOffer[]
    synced_at: string
  }
}
