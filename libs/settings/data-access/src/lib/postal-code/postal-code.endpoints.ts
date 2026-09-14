import type { PostalCodeListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const postalCodeCollectionEndpoint = '/postalcode';

export function postalCodeListEndpoint(
  params: PostalCodeListParams = {},
): string {
  return `${postalCodeCollectionEndpoint}${toSearchParams(params)}`;
}

export function postalCodeDetailEndpoint(id: number): string {
  return `${postalCodeCollectionEndpoint}/${id}`;
}

export function postalCodeLookupEndpoint(activeOnly = true): string {
  return `${postalCodeCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
