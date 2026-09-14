import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import { companyDetailResponseSchema } from '@cms/settings-contract';
import { companyDetailEndpoint } from './company.endpoints';
import { companyKeys } from './company.keys';
import { toCompanyProfile, type CompanyProfile } from './company.form';

export const loadCompany = async (
  companyId: string,
  { signal }: QueryRequestContext,
): Promise<CompanyProfile> => {
  const body = await customFetch<unknown>(companyDetailEndpoint(companyId), {
    signal,
  });
  return toCompanyProfile(companyDetailResponseSchema.parse(body).data);
};

export const companyDetailQueryOptions = (companyId: string) =>
  queryOptions({
    queryKey: companyKeys.detail(companyId),
    queryFn: ({ signal }) => loadCompany(companyId, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'company', operation: 'detail' },
  });
