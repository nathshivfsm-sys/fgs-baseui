import type { SalesActivityOutcomeListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const salesActivityOutcomeCollectionEndpoint = '/salesactivityoutcome';

export function salesActivityOutcomeListEndpoint(
  params: SalesActivityOutcomeListParams = {},
): string {
  return `${salesActivityOutcomeCollectionEndpoint}${toSearchParams(params)}`;
}

export function salesActivityOutcomeDetailEndpoint(id: number): string {
  return `${salesActivityOutcomeCollectionEndpoint}/${id}`;
}

export function salesActivityOutcomeLookupEndpoint(activeOnly = true): string {
  return `${salesActivityOutcomeCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
