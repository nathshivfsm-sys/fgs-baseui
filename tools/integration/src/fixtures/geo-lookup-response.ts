/** Wire envelopes shaped from the FGS Setup Service geo-lookup DTOs. */

export const gloCountryLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      countryCode: 'US',
      countryName: 'United States',
      currencyCode: 'USD',
    },
  ],
  errors: [] as string[],
};

export const gloStateProvinceLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 1,
      countryCode: 'US',
      stateProvinceCode: 'TX',
      stateProvinceName: 'Texas',
    },
  ],
  errors: [] as string[],
};

export const postalCodeCitiesResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      city: 'Houston',
    },
  ],
  errors: [] as string[],
};
