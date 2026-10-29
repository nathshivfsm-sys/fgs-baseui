import type { PaymentTermListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const paymentTermCollectionEndpoint = '/paymentterm';

export function paymentTermListEndpoint(
  params: PaymentTermListParams = {},
): string {
  return `${paymentTermCollectionEndpoint}${toSearchParams(params)}`;
}

export function paymentTermDetailEndpoint(id: number): string {
  return `${paymentTermCollectionEndpoint}/${id}`;
}

export function paymentTermLookupEndpoint(activeOnly = true): string {
  return `${paymentTermCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
