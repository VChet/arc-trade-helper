export function isObject(object: unknown): boolean {
  const type = typeof object;
  return type === "function" || (!!object && type === "object");
}

export const getTypedKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];
