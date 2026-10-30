import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixOtherDetailResponseSchema,
  type PricingMatrixOtherCreateDto,
  type PricingMatrixOtherDetailDto,
  type PricingMatrixOtherPatchDto,
  type PricingMatrixOtherUpdateDto,
} from '@cms/settings-contract';
import {
  pricingMatrixOtherCollectionEndpoint,
  pricingMatrixOtherDetailEndpoint,
} from './pricing-matrix-other.endpoints';
import { pricingMatrixOtherKeys } from './pricing-matrix-other.keys';

async function parsePricingMatrixOtherDetail(
  body: unknown,
): Promise<PricingMatrixOtherDetailDto> {
  return pricingMatrixOtherDetailResponseSchema.parse(body).data;
}

export const createPricingMatrixOther = async (
  body: PricingMatrixOtherCreateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixOtherDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixOtherCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixOtherDetail(response);
};

export const updatePricingMatrixOther = async (
  id: number,
  body: PricingMatrixOtherUpdateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixOtherDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixOtherDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixOtherDetail(response);
};

export const patchPricingMatrixOther = async (
  id: number,
  body: PricingMatrixOtherPatchDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixOtherDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixOtherDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixOtherDetail(response);
};

function invalidatePricingMatrixOthers(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: pricingMatrixOtherKeys.all,
  });
}

export const createPricingMatrixOtherMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: PricingMatrixOtherCreateDto) =>
      createPricingMatrixOther(body),
    meta: { feature: 'pricing-matrix-other', operation: 'create' },
    onSuccess: () => invalidatePricingMatrixOthers(queryClient),
  });

export const updatePricingMatrixOtherMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: PricingMatrixOtherUpdateDto;
    }) => updatePricingMatrixOther(id, body),
    meta: { feature: 'pricing-matrix-other', operation: 'update' },
    onSuccess: () => invalidatePricingMatrixOthers(queryClient),
  });

export const patchPricingMatrixOtherMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: PricingMatrixOtherPatchDto;
    }) => patchPricingMatrixOther(id, body),
    meta: { feature: 'pricing-matrix-other', operation: 'patch' },
    onSuccess: () => invalidatePricingMatrixOthers(queryClient),
  });
