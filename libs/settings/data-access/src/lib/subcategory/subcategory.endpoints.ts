import type { SubcategoryListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/**
 * Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`.
 * Swagger resource is JobTypeTask; the frontend name is subcategory.
 */
export const subcategoryCollectionEndpoint = '/jobtypetask';

export function subcategoryListEndpoint(
  params: SubcategoryListParams = {},
): string {
  return `${subcategoryCollectionEndpoint}${toSearchParams(params)}`;
}

export function subcategoryDetailEndpoint(id: number): string {
  return `${subcategoryCollectionEndpoint}/${id}`;
}

export function subcategoryLookupEndpoint(activeOnly = true): string {
  return `${subcategoryCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
