import type { TagListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const tagCollectionEndpoint = '/tag';

export function tagListEndpoint(params: TagListParams = {}): string {
  return `${tagCollectionEndpoint}${toSearchParams(params)}`;
}

export function tagDetailEndpoint(id: number): string {
  return `${tagCollectionEndpoint}/${id}`;
}

export function tagLookupEndpoint(activeOnly = true): string {
  return `${tagCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
