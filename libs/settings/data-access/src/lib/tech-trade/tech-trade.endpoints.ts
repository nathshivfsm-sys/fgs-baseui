import type { TechTradeListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const techTradeCollectionEndpoint = '/techtrade';

export function techTradeListEndpoint(params: TechTradeListParams = {}): string {
  return `${techTradeCollectionEndpoint}${toSearchParams(params)}`;
}

export function techTradeDetailEndpoint(id: number): string {
  return `${techTradeCollectionEndpoint}/${id}`;
}

export function techTradeLookupEndpoint(activeOnly = true): string {
  return `${techTradeCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
