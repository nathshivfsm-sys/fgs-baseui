import type { JobCategoryListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const jobCategoryCollectionEndpoint = '/jobcategory';

export function jobCategoryListEndpoint(
  params: JobCategoryListParams = {},
): string {
  return `${jobCategoryCollectionEndpoint}${toSearchParams(params)}`;
}

export function jobCategoryDetailEndpoint(id: number): string {
  return `${jobCategoryCollectionEndpoint}/${id}`;
}

export function jobCategoryLookupEndpoint(activeOnly = true): string {
  return `${jobCategoryCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
