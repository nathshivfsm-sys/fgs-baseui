import type { ZoneListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const zoneCollectionEndpoint = '/zone';

export function zoneListEndpoint(params: ZoneListParams = {}): string {
  return `${zoneCollectionEndpoint}${toSearchParams(params)}`;
}

export function zoneDetailEndpoint(id: number): string {
  return `${zoneCollectionEndpoint}/${id}`;
}

export function zoneLookupEndpoint(activeOnly = true): string {
  return `${zoneCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
