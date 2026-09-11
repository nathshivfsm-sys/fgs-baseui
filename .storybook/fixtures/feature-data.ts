import type { Lead } from '@cms/lead-data-access';
import type { CompanyProfile } from '@cms/settings-data-access';
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

/** Mirrors the mapped shape of a real `GET /company/1` response (dev tenant). */
export const companyProfileFixture = {
  companyNumber: '1',
  code: 'acme-field-services-ae23b1',
  generalInfo: {
    name: 'Acme Field Services',
    legalName: 'Acme Field Services',
    companySize: '11-50',
    taxId: '',
    email: 'owner@acme.example.com',
    phoneNumber: '+1 (555) 123-4567',
    website: 'https://acme.example.com',
    timeZone: 'America/Chicago',
    isActive: true,
  },
  physicalAddress: {
    lines: ['100 Main St'],
    city: 'Austin',
    state: 'TX',
    postalCode: '78701',
    country: 'US',
  },
  billingAddress: null,
} satisfies CompanyProfile;

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
