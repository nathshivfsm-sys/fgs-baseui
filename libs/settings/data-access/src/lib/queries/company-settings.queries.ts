import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import { companyEndpoint } from '../company.endpoints';
import { toCompanyProfile } from '../mappers/company-settings.mappers';
import { companyResponseSchema } from '../schemas/company-settings.schema';
import type { CompanyProfile } from '../types/company-profile';
import { companySettingsKeys } from './query-keys';

export type LoadCompanySettings = (
  companyId: string,
  context: QueryRequestContext,
) => Promise<CompanyProfile>;

/**
 * `GET /company/{companyId}`. Typed `unknown` on the way in so the Zod parse, not the
 * type parameter, establishes the shape. A failed request throws `ApiError` and is left
 * to propagate out of the query function.
 */
export const loadCompanySettings: LoadCompanySettings = async (
  companyId,
  { signal },
) => {
  const body = await customFetch<unknown>(companyEndpoint(companyId), {
    signal,
  });
  return toCompanyProfile(companyResponseSchema.parse(body).data);
};

export const companySettingsQueryOptions = (companyId: string) =>
  queryOptions({
    queryKey: companySettingsKeys.detail(companyId),
    queryFn: ({ signal }) => loadCompanySettings(companyId, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'company-settings', operation: 'detail' },
  });
