export async function request<T>(endpoint: string, paramsObj: Record<string, string> = {}): Promise<T> {
  const url = new URL(endpoint);
  Object.entries(paramsObj).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url);
  if (!response.ok) throw new Error(response.statusText);
  return response.json() as T;
}
