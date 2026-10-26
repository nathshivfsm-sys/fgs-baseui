import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const glBreakLookupCollectionEndpoint = '/glbreak/lookup';

export function glBreakLookupEndpoint(activeOnly = true): string {
  return `${glBreakLookupCollectionEndpoint}${toSearchParams({ activeOnly })}`;
}
