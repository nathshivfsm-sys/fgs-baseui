import { http } from 'msw';
import type {
  GloCountryLookupDto,
  GloStateProvinceLookupDto,
  PostalCodeCityLookupDto,
} from '@cms/shared-contract';
import { readOptionalBoolean, setupOk } from './util';

type CountryRecord = GloCountryLookupDto & { isActive: boolean };
type StateProvinceRecord = GloStateProvinceLookupDto & { isActive: boolean };
type CityRecord = PostalCodeCityLookupDto & {
  countryCode: string;
  stateProvinceCode: string;
  isActive: boolean;
};

function seedCountries(): CountryRecord[] {
  return [
    {
      countryCode: 'US',
      countryName: 'United States',
      currencyCode: 'USD',
      isActive: true,
    },
    {
      countryCode: 'CA',
      countryName: 'Canada',
      currencyCode: 'CAD',
      isActive: true,
    },
    {
      countryCode: 'XX',
      countryName: 'Inactive Country',
      currencyCode: 'XXX',
      isActive: false,
    },
  ];
}

function seedStateProvinces(): StateProvinceRecord[] {
  return [
    {
      id: 1,
      countryCode: 'US',
      stateProvinceCode: 'TX',
      stateProvinceName: 'Texas',
      isActive: true,
    },
    {
      id: 2,
      countryCode: 'US',
      stateProvinceCode: 'IL',
      stateProvinceName: 'Illinois',
      isActive: true,
    },
    {
      id: 3,
      countryCode: 'CA',
      stateProvinceCode: 'ON',
      stateProvinceName: 'Ontario',
      isActive: true,
    },
    {
      id: 4,
      countryCode: 'US',
      stateProvinceCode: 'ZZ',
      stateProvinceName: 'Inactive State',
      isActive: false,
    },
  ];
}

function seedCities(): CityRecord[] {
  return [
    {
      city: 'Houston',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      isActive: true,
    },
    {
      city: 'Dallas',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      isActive: true,
    },
    {
      city: 'Austin',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      isActive: true,
    },
    {
      city: 'San Antonio',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      isActive: true,
    },
    {
      city: 'Chicago',
      countryCode: 'US',
      stateProvinceCode: 'IL',
      isActive: true,
    },
    {
      city: 'Springfield',
      countryCode: 'US',
      stateProvinceCode: 'IL',
      isActive: true,
    },
    {
      city: 'Peoria',
      countryCode: 'US',
      stateProvinceCode: 'IL',
      isActive: true,
    },
    {
      city: 'Toronto',
      countryCode: 'CA',
      stateProvinceCode: 'ON',
      isActive: true,
    },
    {
      city: 'Inactiveville',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      isActive: false,
    },
  ];
}

const countries = seedCountries();
const stateProvinces = seedStateProvinces();
const cities = seedCities();

function toCountryLookup(record: CountryRecord): GloCountryLookupDto {
  return {
    countryCode: record.countryCode,
    countryName: record.countryName,
    currencyCode: record.currencyCode,
  };
}

function toStateProvinceLookup(
  record: StateProvinceRecord,
): GloStateProvinceLookupDto {
  return {
    id: record.id,
    countryCode: record.countryCode,
    stateProvinceCode: record.stateProvinceCode,
    stateProvinceName: record.stateProvinceName,
  };
}

function toCityLookup(record: CityRecord): PostalCodeCityLookupDto {
  return { city: record.city };
}

function matchesCode(
  actual: string | null | undefined,
  expected: string | null,
): boolean {
  if (!expected) return true;
  return (actual ?? '').toLowerCase() === expected.toLowerCase();
}

/**
 * In-memory geo lookups (`/glo/country/lookup`, `/glo/stateprovince/lookup`,
 * `/postalcode/cities`). Request/response shapes come from `@cms/shared-contract`.
 * Register before `postalCodeHandlers` so `/postalcode/cities` is not swallowed
 * by `/postalcode/:id`.
 */
export const geoLookupHandlers = [
  http.get('/api/v1/glo/country/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = countries
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toCountryLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/glo/stateprovince/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const countryCode = url.searchParams.get('countryCode');
    const items = stateProvinces
      .filter((record) => {
        if (activeOnly && !record.isActive) return false;
        return matchesCode(record.countryCode, countryCode);
      })
      .map(toStateProvinceLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/postalcode/cities', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const countryCode = url.searchParams.get('countryCode');
    const stateProvinceCode = url.searchParams.get('stateProvinceCode');
    const items = cities
      .filter((record) => {
        if (activeOnly && !record.isActive) return false;
        if (!matchesCode(record.countryCode, countryCode)) return false;
        return matchesCode(record.stateProvinceCode, stateProvinceCode);
      })
      .map(toCityLookup);
    return setupOk(items);
  }),
];
