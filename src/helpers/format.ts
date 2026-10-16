import { ARC_PART_IDS } from "../constants/items.ts";
import { getItemData } from "./data.ts";
import type { MetaForgeItem, MetaForgeTraderOffer } from "@/types/api";
import type { Item, NomadTraderEntry } from "@/types/item";

export function convertToMs(value: number, unit: "seconds" | "minutes" | "hours"): number {
  const unitToMs = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000
  };
  return value * unitToMs[unit];
}

export function formatWeight(weight: number): string {
  return `${Number(weight.toFixed(1))}kg`;
}

export function pluralize(count: number, word: string): string {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}

export function formatItemData(payload: MetaForgeItem): Item {
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

export function formatTraderOffer(payload: MetaForgeTraderOffer): NomadTraderEntry | null {
  const needsArcParts = payload.accepted_items.some((item) => ARC_PART_IDS.includes(item.id));
  if (!needsArcParts) return null;
  const fallback = getItemData("raider-tokens") as Item;
  return {
    itemId: payload.item?.id ?? fallback.id,
    title: payload.offer_title,
    rarity: payload.item?.rarity ?? fallback.rarity,
    icon: payload.item?.icon ?? fallback.icon,
    price: payload.coin_cost
  };
}
