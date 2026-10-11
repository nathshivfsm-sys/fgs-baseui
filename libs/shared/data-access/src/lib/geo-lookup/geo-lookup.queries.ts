import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  gloBillingCategoryTypeLookupResponseSchema,
  gloSetupDescriptionTypeLookupResponseSchema,
  gloCountryLookupResponseSchema,
  gloStateProvinceLookupResponseSchema,
  postalCodeCityLookupResponseSchema,
  type GloBillingCategoryTypeLookupDto,
  type GloSetupDescriptionTypeLookupDto,
  type GloCountryLookupDto,
  type GloStateProvinceLookupDto,
  type GloStateProvinceLookupParams,
  type PostalCodeCityLookupDto,
  type PostalCodeCityLookupParams,
} from '@cms/shared-contract';
import {
  gloBillingCategoryTypeLookupEndpoint,
  gloSetupDescriptionTypeLookupEndpoint,
  gloCountryLookupEndpoint,
  gloStateProvinceLookupEndpoint,
  postalCodeCitiesEndpoint,
} from './geo-lookup.endpoints';
import { geoLookupKeys } from './geo-lookup.keys';

export const loadGloBillingCategoryTypeLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly GloBillingCategoryTypeLookupDto[]> => {
  const body = await customFetch<unknown>(
    gloBillingCategoryTypeLookupEndpoint(activeOnly),
    { signal },
  );
  return gloBillingCategoryTypeLookupResponseSchema.parse(body).data;
};

export const loadGloSetupDescriptionTypeLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly GloSetupDescriptionTypeLookupDto[]> => {
  const body = await customFetch<unknown>(
    gloSetupDescriptionTypeLookupEndpoint(activeOnly),
    { signal },
  );
  return gloSetupDescriptionTypeLookupResponseSchema.parse(body).data;
};

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

export const gloBillingCategoryTypeLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: geoLookupKeys.billingCategoryType(activeOnly),
    queryFn: ({ signal }) =>
      loadGloBillingCategoryTypeLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: {
      feature: 'geo-lookup',
      operation: 'billing-category-type-lookup',
    },
  });

export const gloSetupDescriptionTypeLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: geoLookupKeys.setupDescriptionType(activeOnly),
    queryFn: ({ signal }) =>
      loadGloSetupDescriptionTypeLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: {
      feature: 'geo-lookup',
      operation: 'setup-description-type-lookup',
    },
  });

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
