import type {
  GloStateProvinceLookupParams,
  PostalCodeCityLookupParams,
} from '@cms/shared-contract';

export const geoLookupKeys = {
  all: ['geo-lookup'] as const,
  countries: () => [...geoLookupKeys.all, 'country'] as const,
  country: (activeOnly: boolean) =>
    [...geoLookupKeys.countries(), { activeOnly }] as const,
  stateProvinces: () => [...geoLookupKeys.all, 'state-province'] as const,
  stateProvince: (params: GloStateProvinceLookupParams = {}) =>
    [...geoLookupKeys.stateProvinces(), params] as const,
  cities: () => [...geoLookupKeys.all, 'city'] as const,
  city: (params: PostalCodeCityLookupParams = {}) =>
    [...geoLookupKeys.cities(), params] as const,
} as const;
