import type { TaxAuthorityListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const taxAuthorityCollectionEndpoint = '/taxauthority';

export function taxAuthorityListEndpoint(
  params: TaxAuthorityListParams = {},
): string {
  return `${taxAuthorityCollectionEndpoint}${toSearchParams(params)}`;
}

export function taxAuthorityDetailEndpoint(id: number): string {
  return `${taxAuthorityCollectionEndpoint}/${id}`;
}

export function taxAuthorityLookupEndpoint(activeOnly = true): string {
  return `${taxAuthorityCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
