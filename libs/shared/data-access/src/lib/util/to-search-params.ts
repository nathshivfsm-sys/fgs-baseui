/**
 * Builds a `?a=1&b=true` suffix, omitting `undefined` and empty strings so
 * callers can pass a full params object without producing `?search=`.
 */
export function toSearchParams(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}
