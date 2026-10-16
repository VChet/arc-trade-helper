export async function request<T>(endpoint: string, paramsObj: Record<string, string> = {}): Promise<T> {
  const query = new URLSearchParams(paramsObj);
  const queryString = query.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  const response = await fetch(url);
  if (!response.ok) throw new Error(response.statusText);
  return response.json() as T;
}
