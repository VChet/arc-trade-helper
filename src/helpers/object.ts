import type { WritableDeep } from "type-fest";

export function isObject(object: unknown): boolean {
  const type = typeof object;
  return type === "function" || (!!object && type === "object");
}

export function deepCopy<T>(object: T): WritableDeep<T> {
  return JSON.parse(JSON.stringify(object)) as WritableDeep<T>;
}

export const getTypedKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];
