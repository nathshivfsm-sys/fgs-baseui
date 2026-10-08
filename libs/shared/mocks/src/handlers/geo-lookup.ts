import { http } from 'msw';
import type {
  GloBillingCategoryTypeLookupDto,
  GloCountryLookupDto,
  GloSetupDescriptionTypeLookupDto,
  GloStateProvinceLookupDto,
  PostalCodeCityLookupDto,
} from '@cms/shared-contract';
import { readOptionalBoolean, setupOk } from './util';

type BillingCategoryTypeRecord = GloBillingCategoryTypeLookupDto & {
  isActive: boolean;
};
type CountryRecord = GloCountryLookupDto & { isActive: boolean };
type StateProvinceRecord = GloStateProvinceLookupDto & { isActive: boolean };
type CityRecord = PostalCodeCityLookupDto & {
  countryCode: string;
  stateProvinceCode: string;
  isActive: boolean;
};

type SetupDescriptionTypeRecord = GloSetupDescriptionTypeLookupDto & {
  isActive: boolean;
};

function seedSetupDescriptionTypes(): SetupDescriptionTypeRecord[] {
  return [
    {
      id: 1,
      code: 'REASON_FOR_CALL',
      name: 'Reason For Call',
      isActive: true,
    },
    {
      id: 2,
      code: 'WORK_DESCRIPTION',
      name: 'Work Description',
      isActive: true,
    },
    {
      id: 3,
      code: 'CANCELLATION_REASON',
      name: 'Cancellation reason',
      isActive: true,
    },
    {
      id: 4,
      code: 'LEAD_DISQUALIFICATION',
      name: 'Lead Disqualification Reason',
      isActive: true,
    },
  ];
}

const setupDescriptionTypes = seedSetupDescriptionTypes();

function toSetupDescriptionTypeLookup(
  record: SetupDescriptionTypeRecord,
): GloSetupDescriptionTypeLookupDto {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
  };
}

function seedBillingCategoryTypes(): BillingCategoryTypeRecord[] {
  return [
    {
      billingCategoryType: 'LABOR',
      billingCategoryName: 'Labor',
      displayOrder: 1,
      isActive: true,
    },
    {
      billingCategoryType: 'INVENTORY',
      billingCategoryName: 'Inventory',
      displayOrder: 2,
      isActive: true,
    },
    {
      billingCategoryType: 'NON_INVENTORY',
      billingCategoryName: 'Non-Inventory',
      displayOrder: 3,
      isActive: true,
    },
    {
      billingCategoryType: 'SHIPPING',
      billingCategoryName: 'Shipping',
      displayOrder: 4,
      isActive: true,
    },
    {
      billingCategoryType: 'OTHER',
      billingCategoryName: 'Other',
      displayOrder: 5,
      isActive: true,
    },
    {
      billingCategoryType: 'SERVICE_FEE',
      billingCategoryName: 'Service fee',
      displayOrder: 6,
      isActive: true,
    },
    {
      billingCategoryType: 'SUB_CONTRACTOR',
      billingCategoryName: 'Sub Contractor',
      displayOrder: 7,
      isActive: true,
    },
    {
      billingCategoryType: 'DISCOUNT',
      billingCategoryName: 'Discount',
      displayOrder: 8,
      isActive: true,
    },
    {
      billingCategoryType: 'TAX',
      billingCategoryName: 'Tax',
      displayOrder: 9,
      isActive: true,
    },
    {
      billingCategoryType: 'LEGACY',
      billingCategoryName: 'Legacy Type',
      displayOrder: 99,
      isActive: false,
    },
  ];
}

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

const billingCategoryTypes = seedBillingCategoryTypes();
const countries = seedCountries();
const stateProvinces = seedStateProvinces();
const cities = seedCities();

function toBillingCategoryTypeLookup(
  record: BillingCategoryTypeRecord,
): GloBillingCategoryTypeLookupDto {
  return {
    billingCategoryType: record.billingCategoryType,
    billingCategoryName: record.billingCategoryName,
    displayOrder: record.displayOrder,
  };
}

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
 * In-memory geo lookups (`/glo/country/lookup`, `/glo/billingcategorytype/lookup`,
 * `/glo/stateprovince/lookup`, `/postalcode/cities`). Request/response shapes come
 * from `@cms/shared-contract`.
 * Register before `postalCodeHandlers` so `/postalcode/cities` is not swallowed
 * by `/postalcode/:id`.
 */
export const geoLookupHandlers = [
  http.get('/api/v1/glo/setupdescriptiontype/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = setupDescriptionTypes
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toSetupDescriptionTypeLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/glo/billingcategorytype/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = billingCategoryTypes
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toBillingCategoryTypeLookup);
    return setupOk(items);
  }),

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
