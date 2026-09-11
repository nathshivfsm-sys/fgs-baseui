import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import { companyEndpoint } from '../company.endpoints';
import { companySettingsKeys } from '../queries/query-keys';
import type { CompanyPatch } from '../types/company-profile';

export type SaveCompanySettings = (
  companyId: string,
  patch: CompanyPatch,
  context?: QueryRequestContext,
) => Promise<void>;

/**
 * `PATCH /company/{companyId}` with only the changed fields. The response body is not
 * read: the mutation invalidates the detail query instead, so the screen re-seeds from
 * the server's own view of the record.
 */
export const saveCompanySettings: SaveCompanySettings = async (
  companyId,
  patch,
  context,
) => {
  await customFetch<unknown>(companyEndpoint(companyId), {
    method: 'PATCH',
    body: JSON.stringify(patch),
    signal: context?.signal,
  });
};

/**
 * The write half of the company-settings contract, shaped like
 * `companySettingsQueryOptions` so both directions read the same way at the call site:
 *
 * ```ts
 * const mutation = useMutation(
 *   companySettingsMutationOptions(companyId, queryClient),
 *   queryClient,
 * );
 * ```
 *
 * The invalidation lives here rather than in the screen so the cache rule sits next to
 * the key factory it depends on, and no caller can target the wrong key.
 */
export const companySettingsMutationOptions = (
  companyId: string,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (patch: CompanyPatch) => saveCompanySettings(companyId, patch),
    meta: { feature: 'company-settings', operation: 'update' },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: companySettingsKeys.detail(companyId),
      }),
  });
