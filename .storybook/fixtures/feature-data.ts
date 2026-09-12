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
 * does: `customFetch` → `companyResponseSchema` → `toCompanyProfile`. Values match the
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
