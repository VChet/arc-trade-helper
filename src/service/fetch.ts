import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { ITEM_IDS, RARITY_ORDER } from "../constants/items.ts";
import type { MetaForgeItem, MetaForgeResponse } from "@/types/api";
import type { Item } from "@/types/item";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URL = new URL("https://metaforge.app/api/arc-raiders/items");
const OUTPUT_PATH = join(__dirname, "..", "data");

async function request<T>(paramsObj: Record<string, string>): Promise<T> {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, value]) => params.append(key, value));
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) throw new Error(response.statusText);
  return response.json() as T;
}

function formatItemData(payload: MetaForgeItem): Item {
  return {
    id: payload.id,
    name: payload.name,
    rarity: payload.rarity,
    icon: payload.icon,
    weight: payload.stat_block.weight,
    stackSize: payload.stat_block.stackSize,
    credValue: payload.value
  };
}
async function main() {
  await mkdir(OUTPUT_PATH, { recursive: true });
  const itemsData = await Promise.all(ITEM_IDS.map((id) => request<MetaForgeResponse>({ id })));
  const items = new Map<Item["id"], Item>();
  for (const item of itemsData) items.set(item.data[0].id, formatItemData(item.data[0]));
  const sortedItems = [...items.entries()].sort(([, a], [, b]) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);

  const path = join(OUTPUT_PATH, "items.json");
  const content = JSON.stringify(Object.fromEntries(sortedItems), null, 2);
  await writeFile(path, `${content}\n`, "utf8");
  console.info("Fetch completed");
}

function exit(error: unknown) {
  if (error) console.error(error instanceof Error ? error.message : String(error));
  process.exit(error ? 1 : 0);
}
main().then(exit).catch(exit);
