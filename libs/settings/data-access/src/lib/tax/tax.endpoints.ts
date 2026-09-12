import type { TaxListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const taxCollectionEndpoint = '/tax';

export function taxListEndpoint(params: TaxListParams = {}): string {
  return `${taxCollectionEndpoint}${toSearchParams(params)}`;
}

export function taxDetailEndpoint(id: number): string {
  return `${taxCollectionEndpoint}/${id}`;
}

export function taxLookupEndpoint(activeOnly = true): string {
  return `${taxCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
