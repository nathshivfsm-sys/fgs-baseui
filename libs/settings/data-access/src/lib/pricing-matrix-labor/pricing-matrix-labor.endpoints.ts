import type {
  PricingMatrixLaborListParams,
  PricingMatrixLaborLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const pricingMatrixLaborCollectionEndpoint = '/pricingmatrixlabor';

export function pricingMatrixLaborListEndpoint(
  params: PricingMatrixLaborListParams = {},
): string {
  return `${pricingMatrixLaborCollectionEndpoint}${toSearchParams(params)}`;
}

export function pricingMatrixLaborDetailEndpoint(id: number): string {
  return `${pricingMatrixLaborCollectionEndpoint}/${id}`;
}

export function pricingMatrixLaborLookupEndpoint(
  params: PricingMatrixLaborLookupParams = {},
): string {
  return `${pricingMatrixLaborCollectionEndpoint}/lookup${toSearchParams({
    activeOnly: params.activeOnly ?? true,
    pricingMatrixId: params.pricingMatrixId,
  })}`;
}
