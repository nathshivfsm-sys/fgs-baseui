import type { SelectOption } from '@cms/ui';
import type {
  GloCountryLookupDto,
  GloStateProvinceLookupDto,
  PostalCodeCityLookupDto,
} from '@cms/shared-contract';

export const toCountrySelectOptions = (
  countries: readonly GloCountryLookupDto[] | undefined,
): SelectOption[] =>
  (countries ?? []).flatMap((country) => {
    const value = country.countryCode?.trim();
    if (!value) return [];
    return [
      {
        value,
        label: country.countryName?.trim() || value,
      },
    ];
  });

export const toStateSelectOptions = (
  states: readonly GloStateProvinceLookupDto[] | undefined,
): SelectOption[] =>
  (states ?? []).flatMap((state) => {
    const value = state.stateProvinceCode?.trim();
    if (!value) return [];
    return [
      {
        value,
        label: state.stateProvinceName?.trim() || value,
      },
    ];
  });

export const toCitySelectOptions = (
  cities: readonly PostalCodeCityLookupDto[] | undefined,
): SelectOption[] =>
  (cities ?? []).flatMap((item) => {
    const value = item.city?.trim();
    if (!value) return [];
    return [{ value, label: value }];
  });
