import type {
  BillingCategoryListParams,
  BillingCategoryLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const billingCategoryCollectionEndpoint = '/billingcategory';

export function billingCategoryListEndpoint(
  params: BillingCategoryListParams = {},
): string {
  return `${billingCategoryCollectionEndpoint}${toSearchParams(params)}`;
}

export function billingCategoryDetailEndpoint(id: number): string {
  return `${billingCategoryCollectionEndpoint}/${id}`;
}

export function billingCategoryLookupEndpoint(
  params: BillingCategoryLookupParams = {},
): string {
  return `${billingCategoryCollectionEndpoint}/lookup${toSearchParams({
    activeOnly: params.activeOnly ?? true,
    showToFieldTech: params.showToFieldTech,
    allowToPick: params.allowToPick,
  })}`;
}
