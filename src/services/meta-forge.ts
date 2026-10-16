import { request } from "./request.ts";
import type {
  MetaForgeItem,
  MetaForgeItemsResponse,
  MetaForgeTradeHistoryResponse,
  MetaForgeTradersResponse
} from "@/types/api";

const API_BASE = "https://metaforge.app/api/arc-raiders";
export const API = {
  items: `${API_BASE}/items`,
  traders: `${API_BASE}/traders`,
  tradeStats: "/api/metaforge/trade/stats"
};

export async function fetchItems(itemIds: readonly string[]) {
  return await Promise.all(itemIds.map((id) => request<MetaForgeItemsResponse>(API.items, { id })));
}

export async function fetchPriceHistory(itemId: MetaForgeItem["id"]) {
  const response = await request<MetaForgeTradeHistoryResponse>(`${API.tradeStats}/${itemId}/prices`, { range: "7d" });
  return response.data;
}

export async function fetchNomadItems() {
  const response = await request<MetaForgeTradersResponse>(API.traders);
  return response.ermal.offers;
}
