import type {
  PricingMatrixOtherListParams,
  PricingMatrixOtherLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const pricingMatrixOtherCollectionEndpoint = '/pricingmatrixother';

export function pricingMatrixOtherListEndpoint(
  params: PricingMatrixOtherListParams = {},
): string {
  return `${pricingMatrixOtherCollectionEndpoint}${toSearchParams(params)}`;
}

export function pricingMatrixOtherDetailEndpoint(id: number): string {
  return `${pricingMatrixOtherCollectionEndpoint}/${id}`;
}

export function pricingMatrixOtherLookupEndpoint(
  params: PricingMatrixOtherLookupParams = {},
): string {
  return `${pricingMatrixOtherCollectionEndpoint}/lookup${toSearchParams({
    activeOnly: params.activeOnly ?? true,
    pricingMatrixId: params.pricingMatrixId,
  })}`;
}
