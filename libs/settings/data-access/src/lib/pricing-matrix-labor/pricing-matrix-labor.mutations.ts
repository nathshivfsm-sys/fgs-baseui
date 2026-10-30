import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixLaborDetailResponseSchema,
  type PricingMatrixLaborCreateDto,
  type PricingMatrixLaborDetailDto,
  type PricingMatrixLaborPatchDto,
  type PricingMatrixLaborUpdateDto,
} from '@cms/settings-contract';
import {
  pricingMatrixLaborCollectionEndpoint,
  pricingMatrixLaborDetailEndpoint,
} from './pricing-matrix-labor.endpoints';
import { pricingMatrixLaborKeys } from './pricing-matrix-labor.keys';

async function parsePricingMatrixLaborDetail(
  body: unknown,
): Promise<PricingMatrixLaborDetailDto> {
  return pricingMatrixLaborDetailResponseSchema.parse(body).data;
}

export const createPricingMatrixLabor = async (
  body: PricingMatrixLaborCreateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixLaborDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixLaborCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixLaborDetail(response);
};

export const updatePricingMatrixLabor = async (
  id: number,
  body: PricingMatrixLaborUpdateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixLaborDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixLaborDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixLaborDetail(response);
};

export const patchPricingMatrixLabor = async (
  id: number,
  body: PricingMatrixLaborPatchDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixLaborDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixLaborDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixLaborDetail(response);
};

function invalidatePricingMatrixLabors(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: pricingMatrixLaborKeys.all,
  });
}

export const createPricingMatrixLaborMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: PricingMatrixLaborCreateDto) =>
      createPricingMatrixLabor(body),
    meta: { feature: 'pricing-matrix-labor', operation: 'create' },
    onSuccess: () => invalidatePricingMatrixLabors(queryClient),
  });

export const updatePricingMatrixLaborMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: PricingMatrixLaborUpdateDto;
    }) => updatePricingMatrixLabor(id, body),
    meta: { feature: 'pricing-matrix-labor', operation: 'update' },
    onSuccess: () => invalidatePricingMatrixLabors(queryClient),
  });

export const patchPricingMatrixLaborMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: PricingMatrixLaborPatchDto;
    }) => patchPricingMatrixLabor(id, body),
    meta: { feature: 'pricing-matrix-labor', operation: 'patch' },
    onSuccess: () => invalidatePricingMatrixLabors(queryClient),
  });
