import { request } from "./request.ts";
import type { MetaForgeItemsResponse, MetaForgeTradersResponse } from "@/types/api";

const API_BASE = "https://metaforge.app/api/arc-raiders";
export const API = {
  items: `${API_BASE}/items`,
  traders: `${API_BASE}/traders`
};

export async function fetchItems(itemIds: readonly string[]) {
  return await Promise.all(itemIds.map((id) => request<MetaForgeItemsResponse>(API.items, { id })));
}

export async function fetchNomadItems() {
  const response = await request<MetaForgeTradersResponse>(API.traders);
  return response.ermal.offers;
}
