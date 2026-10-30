import type {
  PricingMatrixLaborTierListParams,
  PricingMatrixLaborTierLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const pricingMatrixLaborTierCollectionEndpoint =
  '/pricingmatrixlabortier';

export function pricingMatrixLaborTierListEndpoint(
  params: PricingMatrixLaborTierListParams = {},
): string {
  return `${pricingMatrixLaborTierCollectionEndpoint}${toSearchParams(params)}`;
}

export function pricingMatrixLaborTierDetailEndpoint(id: number): string {
  return `${pricingMatrixLaborTierCollectionEndpoint}/${id}`;
}

export function pricingMatrixLaborTierLookupEndpoint(
  params: PricingMatrixLaborTierLookupParams = {},
): string {
  return `${pricingMatrixLaborTierCollectionEndpoint}/lookup${toSearchParams({
    activeOnly: params.activeOnly ?? true,
    pricingMatrixLaborId: params.pricingMatrixLaborId,
  })}`;
}
