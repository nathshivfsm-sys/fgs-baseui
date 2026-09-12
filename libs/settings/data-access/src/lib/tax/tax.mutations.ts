import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  taxDetailResponseSchema,
  type TaxCreateDto,
  type TaxDetailDto,
  type TaxPatchDto,
  type TaxUpdateDto,
} from '@cms/settings-contract';
import {
  taxCollectionEndpoint,
  taxDetailEndpoint,
} from './tax.endpoints';
import { taxKeys } from './tax.keys';

async function parseTaxDetail(body: unknown): Promise<TaxDetailDto> {
  return taxDetailResponseSchema.parse(body).data;
}

export const createTax = async (
  body: TaxCreateDto,
  context?: QueryRequestContext,
): Promise<TaxDetailDto> => {
  const response = await customFetch<unknown>(taxCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTaxDetail(response);
};

export const updateTax = async (
  id: number,
  body: TaxUpdateDto,
  context?: QueryRequestContext,
): Promise<TaxDetailDto> => {
  const response = await customFetch<unknown>(taxDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTaxDetail(response);
};

export const patchTax = async (
  id: number,
  body: TaxPatchDto,
  context?: QueryRequestContext,
): Promise<TaxDetailDto> => {
  const response = await customFetch<unknown>(taxDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTaxDetail(response);
};

function invalidateTaxes(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: taxKeys.all });
}

export const createTaxMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: TaxCreateDto) => createTax(body),
    meta: { feature: 'tax', operation: 'create' },
    onSuccess: () => invalidateTaxes(queryClient),
  });

export const updateTaxMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TaxUpdateDto }) =>
      updateTax(id, body),
    meta: { feature: 'tax', operation: 'update' },
    onSuccess: () => invalidateTaxes(queryClient),
  });

export const patchTaxMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TaxPatchDto }) =>
      patchTax(id, body),
    meta: { feature: 'tax', operation: 'patch' },
    onSuccess: () => invalidateTaxes(queryClient),
  });
