import { useMemo } from 'react';
import { useQuery, type QueryClient } from '@tanstack/react-query';
import {
  gloCountryLookupQueryOptions,
  gloStateProvinceLookupQueryOptions,
  postalCodeCitiesQueryOptions,
} from '@cms/shared-data-access';
import type { SelectOption } from '@cms/ui';
import {
  toCitySelectOptions,
  toCountrySelectOptions,
  toStateSelectOptions,
} from './to-geo-select-options';

export type GeoLookupOptionsParams = {
  countryCode?: string;
  enabled?: boolean;
  includeCities?: boolean;
  loadStatesWithoutCountry?: boolean;
  stateProvinceCode?: string;
};

export type GeoLookupOptions = {
  cityOptions: SelectOption[];
  countryOptions: SelectOption[];
  stateOptions: SelectOption[];
};

export const useGeoLookupOptions = (
  queryClient: QueryClient,
  params: GeoLookupOptionsParams = {},
): GeoLookupOptions => {
  const enabled = params.enabled ?? true;
  const countryCode = params.countryCode?.trim() || undefined;
  const stateProvinceCode = params.stateProvinceCode?.trim() || undefined;
  const includeCities = params.includeCities ?? true;
  const loadStatesWithoutCountry = params.loadStatesWithoutCountry ?? false;

  const countryQuery = useQuery(
    { ...gloCountryLookupQueryOptions(), enabled },
    queryClient,
  );
  const stateQuery = useQuery(
    {
      ...gloStateProvinceLookupQueryOptions({
        countryCode,
        activeOnly: true,
      }),
      enabled: enabled && (loadStatesWithoutCountry || countryCode != null),
    },
    queryClient,
  );
  const cityQuery = useQuery(
    {
      ...postalCodeCitiesQueryOptions({
        countryCode,
        stateProvinceCode,
        activeOnly: true,
      }),
      enabled:
        enabled &&
        includeCities &&
        stateProvinceCode != null &&
        (loadStatesWithoutCountry || countryCode != null),
    },
    queryClient,
  );

  const countryOptions = useMemo(
    () => toCountrySelectOptions(countryQuery.data),
    [countryQuery.data],
  );
  const stateOptions = useMemo(
    () => toStateSelectOptions(stateQuery.data),
    [stateQuery.data],
  );
  const cityOptions = useMemo(
    () => toCitySelectOptions(cityQuery.data),
    [cityQuery.data],
  );

  return { cityOptions, countryOptions, stateOptions };
};
