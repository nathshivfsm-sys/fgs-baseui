import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import {
  companySettingsSchema,
  type CompanySettings,
} from './company-settings.schema';

export type LoadCompanySettings = (
  companyId: string,
  context: QueryRequestContext,
) => Promise<CompanySettings>;

export type SaveCompanySettings = (
  companyId: string,
  settings: CompanySettings,
) => Promise<CompanySettings>;

const COMPANY_SETTINGS_FIXTURE: Omit<CompanySettings, 'companyId'> = {
  companyName: 'Graceful Cleaning',
  contactEmail: 'ops@gracefulcleaning.example',
  phone: '(555) 014-2200',
  address: '1200 Market Street, Suite 400',
  ptos: [
    {
      id: 'pto-vac',
      code: 'VAC',
      label: 'Vacation',
      annualAllowance: 15,
    },
    { id: 'pto-sick', code: 'SICK', label: 'Sick', annualAllowance: 8 },
  ],
  taxCodes: [
    {
      id: 'tax-ca',
      code: 'CA',
      description: 'California state sales tax',
      rate: 7.25,
    },
  ],
  businessUnits: [
    { id: 'bu-res', name: 'Residential', code: 'RES', active: true },
    { id: 'bu-com', name: 'Commercial', code: 'COM', active: true },
  ],
};

/**
 * No real backend exists yet (see libs/shared/api/README.md) — this returns static
 * mock data rather than calling customFetch. The Zod parse below still runs so a
 * response shape mismatch is caught the same way it would be once this calls a real
 * endpoint.
 */
export const loadCompanySettings: LoadCompanySettings = async (companyId) =>
  companySettingsSchema.parse({
    ...COMPANY_SETTINGS_FIXTURE,
    companyId,
    companyName: `${COMPANY_SETTINGS_FIXTURE.companyName} · ${companyId}`,
  });

export const saveCompanySettings: SaveCompanySettings = async (
  companyId,
  settings,
) => companySettingsSchema.parse({ ...settings, companyId });

export const companySettingsKeys = {
  all: ['company-settings'] as const,
  details: () => [...companySettingsKeys.all, 'detail'] as const,
  detail: (companyId: string) =>
    [...companySettingsKeys.details(), { companyId }] as const,
};

export const companySettingsQueryOptions = (
  companyId: string,
  load: LoadCompanySettings = loadCompanySettings,
) =>
  queryOptions({
    queryKey: companySettingsKeys.detail(companyId),
    queryFn: ({ signal }) => load(companyId, { signal }),
    meta: { feature: 'company-settings', operation: 'detail' },
  });
