import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import {
  defaultCompanySettings,
  readCompanySettingsStore,
  writeCompanySettingsStore,
} from '../mocks/company-settings.mock';
import { companySettingsKeys } from './query-keys';
import type { CompanySettings } from '../schemas/company-settings.schema';

export type LoadCompanySettings = (
  companyId: string,
  context: QueryRequestContext,
) => Promise<CompanySettings>;

/**
 * No real backend exists yet (see libs/shared/api/README.md) — this returns
 * static mock data rather than calling customFetch. Zod parse still runs in
 * the mock store so a response-shape mismatch is caught the same way it would
 * be once this calls a real endpoint.
 */
export const loadCompanySettings: LoadCompanySettings = async (companyId) => {
  const existing = readCompanySettingsStore(companyId);
  if (existing) return existing;
  return writeCompanySettingsStore(companyId, defaultCompanySettings(companyId));
};

export const companySettingsQueryOptions = (
  companyId: string,
  load: LoadCompanySettings = loadCompanySettings,
) =>
  queryOptions({
    queryKey: companySettingsKeys.detail(companyId),
    queryFn: ({ signal }) => load(companyId, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'company-settings', operation: 'detail' },
  });
