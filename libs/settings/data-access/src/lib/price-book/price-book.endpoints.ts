import type { PriceBookListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const priceBookCollectionEndpoint = '/pricebook';

export function priceBookListEndpoint(
  params: PriceBookListParams = {},
): string {
  return `${priceBookCollectionEndpoint}${toSearchParams(params)}`;
}

export function priceBookDetailEndpoint(id: number): string {
  return `${priceBookCollectionEndpoint}/${id}`;
}

export function priceBookLookupEndpoint(activeOnly = true): string {
  return `${priceBookCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
