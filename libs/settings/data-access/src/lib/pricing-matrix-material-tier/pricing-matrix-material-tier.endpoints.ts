import type {
  PricingMatrixMaterialTierListParams,
  PricingMatrixMaterialTierLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const pricingMatrixMaterialTierCollectionEndpoint =
  '/pricingmatrixmaterialtier';

export function pricingMatrixMaterialTierListEndpoint(
  params: PricingMatrixMaterialTierListParams = {},
): string {
  return `${pricingMatrixMaterialTierCollectionEndpoint}${toSearchParams(params)}`;
}

export function pricingMatrixMaterialTierDetailEndpoint(id: number): string {
  return `${pricingMatrixMaterialTierCollectionEndpoint}/${id}`;
}

export function pricingMatrixMaterialTierLookupEndpoint(
  params: PricingMatrixMaterialTierLookupParams = {},
): string {
  return `${pricingMatrixMaterialTierCollectionEndpoint}/lookup${toSearchParams(
    {
      activeOnly: params.activeOnly ?? true,
      pricingMatrixId: params.pricingMatrixId,
    },
  )}`;
}
