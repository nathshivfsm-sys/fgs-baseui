import { z } from 'zod';
import { apiResponseSchema, nullableText } from './envelope.schema';

/**
 * Wire shapes of Setup Service geo lookups: `/glo/country/lookup`,
 * `/glo/stateprovince/lookup`, and `/postalcode/cities`.
 */

export const gloCountryLookupDtoSchema = z.object({
  countryCode: nullableText,
  countryName: nullableText,
  currencyCode: nullableText,
});

export const gloStateProvinceLookupDtoSchema = z.object({
  id: z.number(),
  countryCode: nullableText,
  stateProvinceCode: nullableText,
  stateProvinceName: nullableText,
});

export const postalCodeCityLookupDtoSchema = z.object({
  city: nullableText,
});

export const gloCountryLookupResponseSchema = apiResponseSchema(
  z.array(gloCountryLookupDtoSchema),
);
export const gloStateProvinceLookupResponseSchema = apiResponseSchema(
  z.array(gloStateProvinceLookupDtoSchema),
);
export const postalCodeCityLookupResponseSchema = apiResponseSchema(
  z.array(postalCodeCityLookupDtoSchema),
);

export type GloCountryLookupDto = z.infer<typeof gloCountryLookupDtoSchema>;
export type GloStateProvinceLookupDto = z.infer<
  typeof gloStateProvinceLookupDtoSchema
>;
export type PostalCodeCityLookupDto = z.infer<
  typeof postalCodeCityLookupDtoSchema
>;

export type GloCountryLookupParams = {
  activeOnly?: boolean;
};

export type GloStateProvinceLookupParams = {
  countryCode?: string;
  activeOnly?: boolean;
};

export type PostalCodeCityLookupParams = {
  countryCode?: string;
  stateProvinceCode?: string;
  activeOnly?: boolean;
};
