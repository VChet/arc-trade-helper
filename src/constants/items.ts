import type { Item } from "@/types/item";

export const ARC_PART_IDS = [
  "bastion-part",
  "bombardier-cell",
  "leaper-pulse-unit",
  "matriarch-reactor",
  "queen-reactor",
  "rocketeer-part"
] as const satisfies readonly Item["id"][];

export const ITEM_IDS = [
  ...ARC_PART_IDS,
  "assorted-seeds",
  "blaze-grenade-trap",
  "bobcat-iv",
  "deadline",
  "dolabra",
  "familiar-duck",
  "hullcracker-ii",
  "raider-tokens",
  "showstopper",
  "snap-hook",
  "stencil-parts"
] as const satisfies readonly Item["id"][];

export const INVENTORY_ITEMS = [
  ...ARC_PART_IDS,
  "assorted-seeds",
  "bobcat-iv",
  "deadline",
  "familiar-duck",
  "showstopper",
  "snap-hook"
] as const satisfies readonly Item["id"][];

export const RARITY_ORDER: Record<Item["rarity"], number> = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
  Amplified: 5
};
