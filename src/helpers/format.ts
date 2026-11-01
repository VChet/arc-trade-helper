import { ARC_PART_IDS, TOKENS_ID } from "../constants/items.ts";
import { getItemData } from "./data.ts";
import type { MetaForgeItem, MetaForgeTraderOffer, MetaForgeTraderService } from "@/types/api";
import type { Item, NomadTraderOffer, NomadTraderService } from "@/types/item";

export function convertToMs(value: number, unit: "seconds" | "minutes" | "hours"): number {
  const unitToMs = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000
  };
  return value * unitToMs[unit];
}

const NumberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
export function formatNumber(value: number): string {
  return NumberFormatter.format(value);
}

const WeightFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilogram",
  unitDisplay: "narrow",
  maximumFractionDigits: 1
});
export function formatWeight(weight: number): string {
  return WeightFormatter.format(weight);
}

const CredFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
export function formatCredValue(value: number): string {
  return `${CredFormatter.format(value)} cred`;
}

export function pluralize(count: number, word: string): string {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}

export function formatHoursAndMinutes(milliseconds: number): string {
  const totalMinutes = Math.floor(milliseconds / convertToMs(1, "minutes"));
  const formattedHours = Math.floor(totalMinutes / 60);
  const formattedMinutes = totalMinutes % 60;
  const parts = [];

  if (formattedHours) parts.push(pluralize(formattedHours, "hour"));
  if (formattedMinutes || !formattedHours) parts.push(pluralize(formattedMinutes, "minute"));

  return parts.join(", ");
}

export function formatTimeLeft(isoDate: string): string {
  const now = new Date();
  const targetDate = new Date(isoDate);
  const diffMs = targetDate.getTime() - now.getTime();
  if (diffMs <= 0) return "—";
  return formatHoursAndMinutes(diffMs);
}

export function formatItemData(payload: MetaForgeItem): Item {
  return {
    id: payload.id,
    name: payload.name,
    rarity: payload.rarity ?? "Common",
    icon: payload.icon,
    weight: payload.stat_block.weight ?? 0,
    stackSize: payload.stat_block.stackSize ?? 0,
    credValue: payload.value ?? 0
  };
}

export function formatTraderOffer(payload: MetaForgeTraderOffer): NomadTraderOffer | null {
  const needsArcParts = payload.accepted_items.some((item) => ARC_PART_IDS.includes(item.id));
  if (!needsArcParts) return null;

  if (payload.item) {
    return {
      itemId: payload.item.id,
      title: payload.offer_title,
      rarity: payload.item.rarity ?? "Common",
      icon: payload.item.icon,
      price: payload.coin_cost,
      expires: payload.offer_end
    };
  }

  const { id: itemId, rarity, icon } = getItemData(TOKENS_ID);
  return {
    itemId,
    title: payload.offer_title,
    rarity,
    icon,
    price: payload.coin_cost,
    expires: payload.offer_end
  };
}
export function formatTraderService(payload: MetaForgeTraderService): NomadTraderService | null {
  const needsArcParts = payload.accepted_items.some((item) => ARC_PART_IDS.includes(item.id));
  if (!needsArcParts) return null;
  return {
    id: payload.id,
    name: payload.name,
    price: payload.coin_cost
  };
}
