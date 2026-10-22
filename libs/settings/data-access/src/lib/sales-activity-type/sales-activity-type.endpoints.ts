import type { SalesActivityTypeListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const salesActivityTypeCollectionEndpoint = '/salesactivitytype';

export function salesActivityTypeListEndpoint(
  params: SalesActivityTypeListParams = {},
): string {
  return `${salesActivityTypeCollectionEndpoint}${toSearchParams(params)}`;
}

export function salesActivityTypeDetailEndpoint(id: number): string {
  return `${salesActivityTypeCollectionEndpoint}/${id}`;
}

export function salesActivityTypeLookupEndpoint(activeOnly = true): string {
  return `${salesActivityTypeCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
