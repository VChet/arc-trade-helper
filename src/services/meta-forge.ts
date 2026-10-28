import { request } from "./request.ts";
import type {
  MetaForgeItem,
  MetaForgeItemsResponse,
  MetaForgeLiveTradesResponse,
  MetaForgeTradersResponse
} from "@/types/api";

const API_BASE = "https://metaforge.app/api/arc-raiders";
export const API = {
  items: `${API_BASE}/items`,
  traders: `${API_BASE}/traders`,
  liveBatchTrades: "/api/metaforge/trade/stats/live-batch"
};

export async function fetchItems(itemIds: readonly string[]) {
  return await Promise.all(itemIds.map((id) => request<MetaForgeItemsResponse>(API.items, { id })));
}

export async function fetchLiveTrades(itemId: MetaForgeItem["id"]) {
  const response = await request<MetaForgeLiveTradesResponse>(API.liveBatchTrades, {
    item_id: itemId,
    limit: "50",
    trade_type: "seed"
  });
  return response.data;
}

export async function fetchNomadTrader() {
  const response = await request<MetaForgeTradersResponse>(API.traders);
  return response.ermal;
}
