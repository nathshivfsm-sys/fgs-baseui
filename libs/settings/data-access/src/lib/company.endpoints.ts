/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export function companyEndpoint(companyId: string): string {
  return `/company/${encodeURIComponent(companyId)}`;
}
