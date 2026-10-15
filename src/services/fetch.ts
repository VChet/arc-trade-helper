import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { ITEM_IDS, RARITY_ORDER } from "../constants/items.ts";
import { formatItemData, formatTraderOffer } from "../helpers/format.ts";
import { fetchItems, fetchNomadItems } from "./meta-forge.ts";
import type { Item } from "@/types/item";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "data");

async function fetchItemsData(ids: string[]) {
  function sortItems([_keyA, a]: [string, Item], [_keyB, b]: [string, Item]): number {
    return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
  }

  const path = join(OUTPUT_PATH, "items.json");
  const items = new Map<Item["id"], Item>();
  const itemsData = await fetchItems(ids);
  for (const item of itemsData) items.set(item.data[0].id, formatItemData(item.data[0]));
  const sortedItems = [...items.entries()].sort(sortItems);
  const content = JSON.stringify(Object.fromEntries(sortedItems), null, 2);
  await writeFile(path, `${content}\n`, "utf8");
  return sortedItems.length;
}
async function fetchTradersData() {
  const path = join(OUTPUT_PATH, "nomad-trader.json");
  const offersData = await fetchNomadItems();
  const sortedItems = offersData
    .map(formatTraderOffer)
    .filter(Boolean)
    .sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
  const content = JSON.stringify(sortedItems, null, 2);
  await writeFile(path, `${content}\n`, "utf8");
  return sortedItems.map((item) => item.itemId);
}
async function main() {
  await mkdir(OUTPUT_PATH, { recursive: true });
  const traderItemIds = await fetchTradersData();
  const itemCount = await fetchItemsData([...traderItemIds, ...ITEM_IDS]);
  console.info(`Fetched ${itemCount} items and ${traderItemIds.length} trader offers`);
}

function exit(error: unknown) {
  if (error) console.error(error instanceof Error ? error.message : String(error));
  process.exit(error ? 1 : 0);
}
main().then(exit).catch(exit);
