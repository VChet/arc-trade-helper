import itemsData from "../data/items.json" with { type: "json" };

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
export interface MetaForgeResponse {
  data: MetaForgeItem[]
  maxValue: number
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}
