import type {
  GloStateProvinceLookupParams,
  PostalCodeCityLookupParams,
} from '@cms/shared-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const gloCountryLookupCollectionEndpoint = '/glo/country/lookup';
export const gloStateProvinceLookupCollectionEndpoint =
  '/glo/stateprovince/lookup';
export const postalCodeCitiesCollectionEndpoint = '/postalcode/cities';

export function gloCountryLookupEndpoint(activeOnly = true): string {
  return `${gloCountryLookupCollectionEndpoint}${toSearchParams({ activeOnly })}`;
}

export function gloStateProvinceLookupEndpoint(
  params: GloStateProvinceLookupParams = {},
): string {
  return `${gloStateProvinceLookupCollectionEndpoint}${toSearchParams({
    countryCode: params.countryCode,
    activeOnly: params.activeOnly ?? true,
  })}`;
}

export function postalCodeCitiesEndpoint(
  params: PostalCodeCityLookupParams = {},
): string {
  return `${postalCodeCitiesCollectionEndpoint}${toSearchParams({
    countryCode: params.countryCode,
    stateProvinceCode: params.stateProvinceCode,
    activeOnly: params.activeOnly ?? true,
  })}`;
}
