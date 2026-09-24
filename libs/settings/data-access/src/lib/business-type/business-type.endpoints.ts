import type { BusinessTypeListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const businessTypeCollectionEndpoint = '/businesstype';

export function businessTypeListEndpoint(
  params: BusinessTypeListParams = {},
): string {
  return `${businessTypeCollectionEndpoint}${toSearchParams(params)}`;
}

export function businessTypeDetailEndpoint(id: number): string {
  return `${businessTypeCollectionEndpoint}/${id}`;
}

export function businessTypeLookupEndpoint(activeOnly = true): string {
  return `${businessTypeCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
