import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixDetailResponseSchema,
  type PricingMatrixCreateDto,
  type PricingMatrixDetailDto,
  type PricingMatrixPatchDto,
  type PricingMatrixUpdateDto,
} from '@cms/settings-contract';
import {
  pricingMatrixCollectionEndpoint,
  pricingMatrixDetailEndpoint,
} from './pricing-matrix.endpoints';
import { pricingMatrixKeys } from './pricing-matrix.keys';

async function parsePricingMatrixDetail(
  body: unknown,
): Promise<PricingMatrixDetailDto> {
  return pricingMatrixDetailResponseSchema.parse(body).data;
}

export const createPricingMatrix = async (
  body: PricingMatrixCreateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixDetailDto> => {
  const response = await customFetch<unknown>(pricingMatrixCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePricingMatrixDetail(response);
};

export const updatePricingMatrix = async (
  id: number,
  body: PricingMatrixUpdateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixDetailDto> => {
  const response = await customFetch<unknown>(pricingMatrixDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePricingMatrixDetail(response);
};

export const patchPricingMatrix = async (
  id: number,
  body: PricingMatrixPatchDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixDetailDto> => {
  const response = await customFetch<unknown>(pricingMatrixDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePricingMatrixDetail(response);
};

function invalidatePricingMatrices(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: pricingMatrixKeys.all });
}

export const createPricingMatrixMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: PricingMatrixCreateDto) => createPricingMatrix(body),
    meta: { feature: 'pricing-matrix', operation: 'create' },
    onSuccess: () => invalidatePricingMatrices(queryClient),
  });

export const updatePricingMatrixMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PricingMatrixUpdateDto }) =>
      updatePricingMatrix(id, body),
    meta: { feature: 'pricing-matrix', operation: 'update' },
    onSuccess: () => invalidatePricingMatrices(queryClient),
  });

export const patchPricingMatrixMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PricingMatrixPatchDto }) =>
      patchPricingMatrix(id, body),
    meta: { feature: 'pricing-matrix', operation: 'patch' },
    onSuccess: () => invalidatePricingMatrices(queryClient),
  });
