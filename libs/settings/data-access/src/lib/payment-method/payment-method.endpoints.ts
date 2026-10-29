import type {
  PaymentMethodListParams,
  PaymentMethodLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const paymentMethodCollectionEndpoint = '/paymentmethod';

export function paymentMethodListEndpoint(
  params: PaymentMethodListParams = {},
): string {
  return `${paymentMethodCollectionEndpoint}${toSearchParams(params)}`;
}

export function paymentMethodDetailEndpoint(id: number): string {
  return `${paymentMethodCollectionEndpoint}/${id}`;
}

export function paymentMethodLookupEndpoint(
  params: PaymentMethodLookupParams = {},
): string {
  return `${paymentMethodCollectionEndpoint}/lookup${toSearchParams({
    activeOnly: params.activeOnly ?? true,
    isMobileVisible: params.isMobileVisible,
    isCustomerPortalVisible: params.isCustomerPortalVisible,
  })}`;
}
