import type { Lead } from '@cms/lead-data-access';
import type { CompanyDto } from '@cms/settings-data-access';
import type { Workorder } from '@cms/workorder-data-access';

export const leadFixtures = [
  { id: 'LD-208', name: 'Avery Stone · northwind', stage: 'Qualified' },
  { id: 'LD-209', name: 'Morgan Lee', stage: 'New' },
] satisfies readonly Lead[];

export const workorderFixtures = [
  { id: 'WO-1042', title: 'Inspect HVAC · northwind', status: 'Open' },
  {
    id: 'WO-1043',
    title: 'Replace loading-bay sensor',
    status: 'Scheduled',
  },
] satisfies readonly Workorder[];

/**
 * Wire shape of `GET /company/{companyId}`, so stories drive the same path the app
 * does: `customFetch` → `companyDetailResponseSchema` → `toCompanyProfile`. Values match the
 * redacted capture in `tools/integration/src/fixtures/company-response.ts`, which keeps
 * every key the schema strips; this one carries only what the screen reads.
 */
export const companyResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    companyNumber: 1,
    code: 'acme-field-services-ae23b1',
    name: 'Acme Field Services',
    legalName: 'Acme Field Services',
    email: 'owner@acme.example.com',
    phoneNumber: '15551234567',
    website: 'https://acme.example.com',
    taxId: null,
    companySize: '11-50',
    timeZone: 'America/Chicago',
    isActive: true,
    physicalAddress: {
      addressLine1: '100 Main St',
      addressLine2: null,
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
    },
    billingAddress: null,
  },
} satisfies { success: boolean; statusCode: number; data: CompanyDto };

export const zoneListItemsFixture = [
  {
    id: 31,
    code: 'NORTH',
    name: 'North Zone',
    description: 'Harris County -North',
    isActive: true,
  },
  {
    id: 32,
    code: 'SOUTH',
    name: 'South Zone',
    description: 'Harris County -South',
    isActive: true,
  },
  {
    id: 34,
    code: 'EAST',
    name: 'East Zone',
    description: 'Harris County -East',
    isActive: true,
  },
  {
    id: 35,
    code: 'WEST',
    name: 'West Zone',
    description: 'Harris County -West',
    isActive: true,
  },
  {
    id: 33,
    code: 'CENTRAL',
    name: 'Central Zone',
    description: 'Harris County -Central',
    isActive: true,
  },
  {
    id: 36,
    code: 'OUTER',
    name: 'Outer Zone',
    description: 'Outer-ring coverage',
    isActive: false,
  },
  {
    id: 37,
    code: 'RURAL',
    name: 'Rural Zone',
    description: 'Rural coverage',
    isActive: false,
  },
] as const;

export const nonWorkingDateListItemsFixture = [
  {
    id: 41,
    nonWorkingDate: '2025-01-01',
    name: "New Year's Day",
    isActive: true,
  },
  {
    id: 42,
    nonWorkingDate: '2025-05-26',
    name: 'Memorial Day',
    isActive: true,
  },
  {
    id: 43,
    nonWorkingDate: '2025-07-04',
    name: 'Independence Day',
    isActive: true,
  },
  {
    id: 44,
    nonWorkingDate: '2025-09-01',
    name: 'Labor Day',
    isActive: true,
  },
  {
    id: 45,
    nonWorkingDate: '2025-11-27',
    name: 'Thanksgiving Day',
    isActive: true,
  },
  {
    id: 46,
    nonWorkingDate: '2025-12-25',
    name: 'Christmas Day',
    isActive: false,
  },
] as const;



export const postalCodeListItemsFixture = [
  {
    id: 41,
    postalCode: 'NORTH',
    city: 'Houston',
    state: 'TX',
    countryCode: 'US',
    fgsSetupZoneId: 31,
    zoneCode: 'NORTH',
    zoneName: 'Harris County -North',
    fgsSetupTaxId: 11,
    taxCode: 'TX-STD',
    taxRate: 8.7,
    tripCharge: 10,
    isActive: true,
  },
  {
    id: 42,
    postalCode: 'SOUTH',
    city: 'Houston',
    state: 'TX',
    countryCode: 'US',
    fgsSetupZoneId: 32,
    zoneCode: 'SOUTH',
    zoneName: 'Harris County -South',
    fgsSetupTaxId: 12,
    taxCode: 'TX-LABOR',
    taxRate: 6.2,
    tripCharge: 10,
    isActive: true,
  },
  {
    id: 43,
    postalCode: 'EAST',
    city: 'Dallas',
    state: 'TX',
    countryCode: 'US',
    fgsSetupZoneId: 34,
    zoneCode: 'EAST',
    zoneName: 'Harris County -East',
    fgsSetupTaxId: 11,
    taxCode: 'TX-STD',
    taxRate: 8.7,
    tripCharge: 10,
    isActive: true,
  },
  {
    id: 44,
    postalCode: 'WEST',
    city: 'Chicago',
    state: 'TX',
    countryCode: 'US',
    fgsSetupZoneId: 35,
    zoneCode: 'WEST',
    zoneName: 'Harris County -West',
    fgsSetupTaxId: 11,
    taxCode: 'TX-STD',
    taxRate: 8.7,
    tripCharge: 10,
    isActive: true,
  },
  {
    id: 45,
    postalCode: 'CENTRAL',
    city: 'Dallas',
    state: 'TX',
    countryCode: 'US',
    fgsSetupZoneId: 33,
    zoneCode: 'CENTRAL',
    zoneName: 'Harris County -Central',
    fgsSetupTaxId: 11,
    taxCode: 'TX-STD',
    taxRate: 8.7,
    tripCharge: 10,
    isActive: true,
  },
  {
    id: 46,
    postalCode: 'OUTER',
    city: 'Houston',
    state: 'TX',
    countryCode: 'US',
    fgsSetupZoneId: 36,
    zoneCode: 'OUTER',
    zoneName: 'Outer Zone',
    fgsSetupTaxId: 11,
    taxCode: 'TX-STD',
    taxRate: 8.7,
    tripCharge: 10,
    isActive: false,
  },
  {
    id: 47,
    postalCode: 'RURAL',
    city: 'Houston',
    state: 'TX',
    countryCode: 'US',
    fgsSetupZoneId: 37,
    zoneCode: 'RURAL',
    zoneName: 'Rural Zone',
    fgsSetupTaxId: 11,
    taxCode: 'TX-STD',
    taxRate: 8.7,
    tripCharge: 10,
    isActive: false,
  },
] as const;

export const taxAuthorityListItemsFixture = [
  {
    id: 24,
    code: 'HARRIS',
    name: 'Sales Tax – Harris County',
    regionCode: 'TX',
    isExternalSystemRecord: false,
    taxPercent: 8.25,
    description: 'Harris County',
    effectiveFromDate: '2026-01-23',
    usageCount: 0,
    isActive: true,
  },
  {
    id: 25,
    code: 'DALLAS',
    name: 'Sales Tax – Dallas County',
    regionCode: 'TX',
    isExternalSystemRecord: false,
    taxPercent: 8,
    description: 'Dallas County',
    effectiveFromDate: '2026-05-08',
    usageCount: 0,
    isActive: true,
  },
  {
    id: 21,
    code: 'TX-STATE',
    name: 'Texas State',
    regionCode: 'TX',
    isExternalSystemRecord: false,
    taxPercent: 6.25,
    description: 'State sales tax',
    effectiveFromDate: '2026-01-01',
    usageCount: 2,
    isActive: true,
  },
  {
    id: 22,
    code: 'AUS-CITY',
    name: 'Austin City',
    regionCode: 'TX',
    isExternalSystemRecord: false,
    taxPercent: 2,
    description: 'City sales tax',
    effectiveFromDate: '2026-01-01',
    usageCount: 2,
    isActive: true,
  },
  {
    id: 26,
    code: 'TRAVIS',
    name: 'Sales Tax – Travis County',
    regionCode: 'TX',
    isExternalSystemRecord: false,
    taxPercent: 8.25,
    description: 'Travis County',
    effectiveFromDate: '2026-03-15',
    usageCount: 0,
    isActive: true,
  },
  {
    id: 27,
    code: 'FORTBEND',
    name: 'Sales Tax – Fort Bend County',
    regionCode: 'TX',
    isExternalSystemRecord: false,
    taxPercent: 8.25,
    description: 'Fort Bend County',
    effectiveFromDate: '2026-04-01',
    usageCount: 0,
    isActive: true,
  },
  {
    id: 23,
    code: 'OK-STATE',
    name: 'Oklahoma State',
    regionCode: 'OK',
    isExternalSystemRecord: false,
    taxPercent: 4.5,
    description: 'Inactive authority kept for history',
    effectiveFromDate: '2025-06-01',
    usageCount: 0,
    isActive: false,
  },
  {
    id: 28,
    code: 'RURAL-TX',
    name: 'Sales Tax – Rural',
    regionCode: 'TX',
    isExternalSystemRecord: false,
    taxPercent: 6.25,
    description: 'Rural',
    effectiveFromDate: '2025-12-01',
    usageCount: 0,
    isActive: false,
  },
] as const;

export const taxListItemsFixture = [
  {
    id: 11,
    taxCode: 'TX-STD',
    name: 'Sales Tax – Harris County',
    showTaxDetail: true,
    description: 'State plus city sales tax',
    regionCode: 'TX',
    county: 'Harris County',
    city: 'Houston',
    taxRate: 8.25,
    isActive: true,
  },
  {
    id: 12,
    taxCode: 'TX-LABOR',
    name: 'Labor Tax',
    showTaxDetail: true,
    description: 'Tax applied to labor charges',
    regionCode: 'TX',
    county: 'Dallas County',
    city: 'Dallas',
    taxRate: 8.25,
    isActive: true,
  },
  {
    id: 13,
    taxCode: 'TX-EXEMPT',
    name: 'Exempt',
    showTaxDetail: false,
    description: 'No tax collected',
    regionCode: 'TX',
    county: null,
    city: null,
    taxRate: 0,
    isActive: false,
  },
] as const;

export const techTradeListItemsFixture = [
  {
    id: 51,
    tradeCode: 'HVAC',
    name: 'HVAC- Repair',
    description: 'Heating, Ventilation and Air Conditioning repairing',
    sortOrder: 1,
    isActive: true,
    skillIds: [61, 62],
  },
  {
    id: 52,
    tradeCode: 'PLUMB',
    name: 'Plumbing -Install',
    description: 'Plumbing installation',
    sortOrder: 2,
    isActive: true,
    skillIds: [61, 62],
  },
  {
    id: 53,
    tradeCode: 'HVAC',
    name: 'HVAC Install',
    description: 'Heating, Air Condition Install',
    sortOrder: 3,
    isActive: true,
    skillIds: [61, 62],
  },
  {
    id: 54,
    tradeCode: 'PLUMB',
    name: 'Plumbing Repair',
    description: 'Plumbing repair',
    sortOrder: 4,
    isActive: true,
    skillIds: [61, 62],
  },
  {
    id: 55,
    tradeCode: 'ELEC',
    name: 'Electrical',
    description: 'Residential electrical',
    sortOrder: 5,
    isActive: true,
    skillIds: [61],
  },
  {
    id: 56,
    tradeCode: 'APPL',
    name: 'Appliance',
    description: 'Appliance repair',
    sortOrder: 6,
    isActive: false,
    skillIds: [],
  },
  {
    id: 57,
    tradeCode: 'ARCH',
    name: 'Archived HVAC',
    description: 'Legacy HVAC trade',
    sortOrder: 99,
    isActive: false,
    skillIds: [],
  },
] as const;

export const techSkillLevelListItemsFixture = [
  {
    id: 61,
    code: 'INST',
    name: 'Install',
    description: 'Installation work across trades',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 62,
    code: 'REPR',
    name: 'Repair',
    description: 'Repair and service work',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 63,
    code: 'DIAG',
    name: 'Diagnose',
    description: 'Diagnostic and troubleshooting',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 64,
    code: 'INSP',
    name: 'Inspect',
    description: 'Inspection and safety checks',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 65,
    code: 'MAIN',
    name: 'Maintain',
    description: 'Preventive maintenance',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 66,
    code: 'WELD',
    name: 'Weld',
    description: 'Welding (inactive)',
    sortOrder: 6,
    isActive: false,
  },
  {
    id: 67,
    code: 'PAINT',
    name: 'Paint',
    description: 'Painting (inactive)',
    sortOrder: 7,
    isActive: false,
  },
  {
    id: 68,
    code: 'DEMO',
    name: 'Demo',
    description: 'Demolition (inactive)',
    sortOrder: 99,
    isActive: false,
  },
] as const;

export const taxLookupItemsFixture = [
  {
    id: 11,
    taxCode: 'TX-STD',
    name: 'Standard Tax',
    taxRate: 8.7,
  },
  {
    id: 12,
    taxCode: 'TX-LABOR',
    name: 'Labor Tax',
    taxRate: 6.2,
  },
] as const;


export const resolvedLoader =
  <Item>(items: readonly Item[]) =>
  async () =>
    items;

export const emptyLoader =
  <Item>() =>
  async (): Promise<readonly Item[]> => [];

export const pendingLoader =
  <Item>() =>
  () =>
    new Promise<readonly Item[]>(() => undefined);

export const errorLoader = (message: string) => async () => {
  throw new Error(message);
};
