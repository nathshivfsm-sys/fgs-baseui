import type { NonWorkingDateListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const nonWorkingDateCollectionEndpoint = '/nonworkingdate';

export function nonWorkingDateListEndpoint(
  params: NonWorkingDateListParams = {},
): string {
  return `${nonWorkingDateCollectionEndpoint}${toSearchParams(params)}`;
}

export function nonWorkingDateDetailEndpoint(id: number): string {
  return `${nonWorkingDateCollectionEndpoint}/${id}`;
}

export function nonWorkingDateLookupEndpoint(activeOnly = true): string {
  return `${nonWorkingDateCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
