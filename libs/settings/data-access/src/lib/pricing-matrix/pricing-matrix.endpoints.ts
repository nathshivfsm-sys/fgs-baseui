import type { PricingMatrixListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const pricingMatrixCollectionEndpoint = '/pricingmatrix';

export function pricingMatrixListEndpoint(
  params: PricingMatrixListParams = {},
): string {
  return `${pricingMatrixCollectionEndpoint}${toSearchParams(params)}`;
}

export function pricingMatrixDetailEndpoint(id: number): string {
  return `${pricingMatrixCollectionEndpoint}/${id}`;
}

export function pricingMatrixLookupEndpoint(activeOnly = true): string {
  return `${pricingMatrixCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
