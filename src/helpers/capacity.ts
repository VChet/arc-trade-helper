export const CAPACITY = { default: 20, min: 16, max: 22 };

export function normalizeInventoryCapacity(value: number): number {
  return Math.min(CAPACITY.max, Math.max(CAPACITY.min, Math.round(value)));
}
