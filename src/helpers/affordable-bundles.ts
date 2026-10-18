export function getAffordableBundles(credValue: number, price: number): number {
  return price > 0 ? Math.floor(credValue / price) : 0;
}
