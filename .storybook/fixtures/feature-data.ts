import type { Lead } from '@cms/lead-data-access';
import type { CompanySettings } from '@cms/settings-data-access';
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

export const companySettingsFixture = {
  companyId: 'northwind',
  companyName: 'Graceful Cleaning',
  contactEmail: 'ops@gracefulcleaning.example',
  phone: '(555) 014-2200',
  address: '1200 Market Street, Suite 400',
  ptos: [
    { id: 'pto-vac', code: 'VAC', label: 'Vacation', annualAllowance: 15 },
  ],
  taxCodes: [
    { id: 'tax-ca', code: 'CA', description: 'State tax', rate: 7.25 },
  ],
  businessUnits: [
    { id: 'bu-res', name: 'Residential', code: 'RES', active: true },
  ],
} satisfies CompanySettings;

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
