import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  taxAuthorityDetailResponseSchema,
  type TaxAuthorityCreateDto,
  type TaxAuthorityDetailDto,
  type TaxAuthorityPatchDto,
  type TaxAuthorityUpdateDto,
} from '@cms/settings-contract';
import {
  taxAuthorityCollectionEndpoint,
  taxAuthorityDetailEndpoint,
} from './tax-authority.endpoints';
import { taxAuthorityKeys } from './tax-authority.keys';

async function parseTaxAuthorityDetail(
  body: unknown,
): Promise<TaxAuthorityDetailDto> {
  return taxAuthorityDetailResponseSchema.parse(body).data;
}

export const createTaxAuthority = async (
  body: TaxAuthorityCreateDto,
  context?: QueryRequestContext,
): Promise<TaxAuthorityDetailDto> => {
  const response = await customFetch<unknown>(taxAuthorityCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTaxAuthorityDetail(response);
};

export const updateTaxAuthority = async (
  id: number,
  body: TaxAuthorityUpdateDto,
  context?: QueryRequestContext,
): Promise<TaxAuthorityDetailDto> => {
  const response = await customFetch<unknown>(taxAuthorityDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTaxAuthorityDetail(response);
};

export const patchTaxAuthority = async (
  id: number,
  body: TaxAuthorityPatchDto,
  context?: QueryRequestContext,
): Promise<TaxAuthorityDetailDto> => {
  const response = await customFetch<unknown>(taxAuthorityDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTaxAuthorityDetail(response);
};

function invalidateTaxAuthorities(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: taxAuthorityKeys.all });
}

export const createTaxAuthorityMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: TaxAuthorityCreateDto) => createTaxAuthority(body),
    meta: { feature: 'tax-authority', operation: 'create' },
    onSuccess: () => invalidateTaxAuthorities(queryClient),
  });

export const updateTaxAuthorityMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: TaxAuthorityUpdateDto;
    }) => updateTaxAuthority(id, body),
    meta: { feature: 'tax-authority', operation: 'update' },
    onSuccess: () => invalidateTaxAuthorities(queryClient),
  });

export const patchTaxAuthorityMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TaxAuthorityPatchDto }) =>
      patchTaxAuthority(id, body),
    meta: { feature: 'tax-authority', operation: 'patch' },
    onSuccess: () => invalidateTaxAuthorities(queryClient),
  });
