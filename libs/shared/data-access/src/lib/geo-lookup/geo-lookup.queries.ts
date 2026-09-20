import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  gloCountryLookupResponseSchema,
  gloStateProvinceLookupResponseSchema,
  postalCodeCityLookupResponseSchema,
  type GloCountryLookupDto,
  type GloStateProvinceLookupDto,
  type GloStateProvinceLookupParams,
  type PostalCodeCityLookupDto,
  type PostalCodeCityLookupParams,
} from '@cms/shared-contract';
import {
  gloCountryLookupEndpoint,
  gloStateProvinceLookupEndpoint,
  postalCodeCitiesEndpoint,
} from './geo-lookup.endpoints';
import { geoLookupKeys } from './geo-lookup.keys';

export const loadGloCountryLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly GloCountryLookupDto[]> => {
  const body = await customFetch<unknown>(
    gloCountryLookupEndpoint(activeOnly),
    { signal },
  );
  return gloCountryLookupResponseSchema.parse(body).data;
};

export const loadGloStateProvinceLookup = async (
  params: GloStateProvinceLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly GloStateProvinceLookupDto[]> => {
  const body = await customFetch<unknown>(
    gloStateProvinceLookupEndpoint(params),
    { signal },
  );
  return gloStateProvinceLookupResponseSchema.parse(body).data;
};

export const loadPostalCodeCities = async (
  params: PostalCodeCityLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly PostalCodeCityLookupDto[]> => {
  const body = await customFetch<unknown>(postalCodeCitiesEndpoint(params), {
    signal,
  });
  return postalCodeCityLookupResponseSchema.parse(body).data;
};

export const gloCountryLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: geoLookupKeys.country(activeOnly),
    queryFn: ({ signal }) => loadGloCountryLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'geo-lookup', operation: 'country-lookup' },
  });

export const gloStateProvinceLookupQueryOptions = (
  params: GloStateProvinceLookupParams = {},
) => {
  const resolved: GloStateProvinceLookupParams = {
    countryCode: params.countryCode,
    activeOnly: params.activeOnly ?? true,
  };
  return queryOptions({
    queryKey: geoLookupKeys.stateProvince(resolved),
    queryFn: ({ signal }) => loadGloStateProvinceLookup(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'geo-lookup', operation: 'state-province-lookup' },
  });
};

export const postalCodeCitiesQueryOptions = (
  params: PostalCodeCityLookupParams = {},
) => {
  const resolved: PostalCodeCityLookupParams = {
    countryCode: params.countryCode,
    stateProvinceCode: params.stateProvinceCode,
    activeOnly: params.activeOnly ?? true,
  };
  return queryOptions({
    queryKey: geoLookupKeys.city(resolved),
    queryFn: ({ signal }) => loadPostalCodeCities(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'geo-lookup', operation: 'cities' },
  });
};
