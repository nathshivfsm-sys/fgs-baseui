import type { GlBreakListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const glBreakCollectionEndpoint = '/glbreak';

export function glBreakListEndpoint(params: GlBreakListParams = {}): string {
  return `${glBreakCollectionEndpoint}${toSearchParams(params)}`;
}

export function glBreakDetailEndpoint(id: number): string {
  return `${glBreakCollectionEndpoint}/${id}`;
}

export function glBreakLookupEndpoint(activeOnly = true): string {
  return `${glBreakCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
