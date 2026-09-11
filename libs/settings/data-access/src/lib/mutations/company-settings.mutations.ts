import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import { companyEndpoint } from '../company.endpoints';
import type { CompanyPatch } from '../types/company-profile';

export type SaveCompanySettings = (
  companyId: string,
  patch: CompanyPatch,
  context?: QueryRequestContext,
) => Promise<void>;

/**
 * `PATCH /company/{companyId}` with only the changed fields. The response body is not
 * read: callers invalidate the detail query instead, so the screen re-seeds from the
 * server's own view of the record.
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
