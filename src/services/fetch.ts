import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { ITEM_IDS, RARITY_ORDER } from "../constants/items.ts";
import { formatItemData, formatTraderOffer, formatTraderService, pluralize } from "../helpers/format.ts";
import { fetchItems, fetchNomadTrader } from "./meta-forge.ts";
import type { Item } from "@/types/item";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "data");

async function fetchItemsData(ids: string[]): Promise<number> {
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
  const { offers, permanent_services } = await fetchNomadTrader();
  // Offers
  const offersPath = join(OUTPUT_PATH, "nomad-trader-offers.json");
  const sortedItems = offers
    .map(formatTraderOffer)
    .filter(Boolean)
    .sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
  const offersContent = JSON.stringify(sortedItems, null, 2);
  await writeFile(offersPath, `${offersContent}\n`, "utf8");
  // Services
  const servicesPath = join(OUTPUT_PATH, "nomad-trader-services.json");
  const services = permanent_services
    .map(formatTraderService)
    .filter(Boolean);
  const servicesContent = JSON.stringify(services, null, 2);
  await writeFile(servicesPath, `${servicesContent}\n`, "utf8");
  // Return trader data ids
  return { offers: sortedItems.map(({ itemId }) => itemId), services: services.map(({ id }) => id) };
}
async function main(): Promise<void> {
  await mkdir(OUTPUT_PATH, { recursive: true });
  const { offers, services } = await fetchTradersData();
  console.info(`Fetched ${pluralize(offers.length, "offer")} and ${pluralize(services.length, "service")}.`);
  const itemCount = await fetchItemsData([...offers, ...ITEM_IDS]);
  console.info(`Fetched ${pluralize(itemCount, "item")}.`);
}

function exit(error: unknown) {
  if (error) console.error(error instanceof Error ? error.message : String(error));
  process.exit(error ? 1 : 0);
}
main().then(exit).catch(exit);
