import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import type { CompanyPatchDto } from '@cms/settings-contract';
import { companyDetailEndpoint } from './company.endpoints';
import { companyKeys } from './company.keys';

export const patchCompany = async (
  companyId: string,
  body: CompanyPatchDto,
  context?: QueryRequestContext,
): Promise<void> => {
  await customFetch<unknown>(companyDetailEndpoint(companyId), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
};

function invalidateCompany(queryClient: QueryClient, companyId: string) {
  return queryClient.invalidateQueries({
    queryKey: companyKeys.detail(companyId),
  });
}

export const patchCompanyMutationOptions = (
  companyId: string,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: CompanyPatchDto) => patchCompany(companyId, body),
    meta: { feature: 'company', operation: 'patch' },
    onSuccess: () => invalidateCompany(queryClient, companyId),
  });
