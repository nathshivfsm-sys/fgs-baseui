import type { SourceListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const sourceCollectionEndpoint = '/source';

export function sourceListEndpoint(params: SourceListParams = {}): string {
  return `${sourceCollectionEndpoint}${toSearchParams(params)}`;
}

export function sourceDetailEndpoint(id: number): string {
  return `${sourceCollectionEndpoint}/${id}`;
}

export function sourceLookupEndpoint(activeOnly = true): string {
  return `${sourceCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
