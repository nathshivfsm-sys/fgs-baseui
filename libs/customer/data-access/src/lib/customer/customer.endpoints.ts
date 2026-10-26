import type { CustomerListParams } from '@cms/customer-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const customerCollectionEndpoint = '/customer';

export function customerListEndpoint(params: CustomerListParams = {}): string {
  return `${customerCollectionEndpoint}${toSearchParams(params)}`;
}

export function customerDetailEndpoint(id: number): string {
  return `${customerCollectionEndpoint}/${id}`;
}

export function customerFinancialSummaryEndpoint(id: number): string {
  return `${customerCollectionEndpoint}/${id}/financialsummary`;
}

export function customerLookupEndpoint(activeOnly = true): string {
  return `${customerCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
