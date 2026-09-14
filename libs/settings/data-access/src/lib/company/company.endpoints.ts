/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const companyCollectionEndpoint = '/company';

export function companyDetailEndpoint(companyId: string): string {
  return `${companyCollectionEndpoint}/${encodeURIComponent(companyId)}`;
}

