import type { Item } from "@/types/item";

export const ARC_PART_IDS = [
  "assessor-matrix",
  "bastion-part",
  "bombardier-cell",
  "leaper-pulse-unit",
  "matriarch-reactor",
  "queen-reactor",
  "rocketeer-part",
  "turbine-compressor",
  "vaporizer-regulator"
] as const satisfies readonly Item["id"][];

export const ITEM_IDS = [
  ...ARC_PART_IDS,
  "assorted-seeds",
  "bobcat-iv",
  "deadline",
  "familiar-duck",
  "raider-tokens",
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
