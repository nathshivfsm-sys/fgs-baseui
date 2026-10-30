import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixLaborTierDetailResponseSchema,
  type PricingMatrixLaborTierCreateDto,
  type PricingMatrixLaborTierDetailDto,
  type PricingMatrixLaborTierPatchDto,
  type PricingMatrixLaborTierUpdateDto,
} from '@cms/settings-contract';
import {
  pricingMatrixLaborTierCollectionEndpoint,
  pricingMatrixLaborTierDetailEndpoint,
} from './pricing-matrix-labor-tier.endpoints';
import { pricingMatrixLaborTierKeys } from './pricing-matrix-labor-tier.keys';

async function parsePricingMatrixLaborTierDetail(
  body: unknown,
): Promise<PricingMatrixLaborTierDetailDto> {
  return pricingMatrixLaborTierDetailResponseSchema.parse(body).data;
}

export const createPricingMatrixLaborTier = async (
  body: PricingMatrixLaborTierCreateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixLaborTierDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixLaborTierCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixLaborTierDetail(response);
};

export const updatePricingMatrixLaborTier = async (
  id: number,
  body: PricingMatrixLaborTierUpdateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixLaborTierDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixLaborTierDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixLaborTierDetail(response);
};

export const patchPricingMatrixLaborTier = async (
  id: number,
  body: PricingMatrixLaborTierPatchDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixLaborTierDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixLaborTierDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixLaborTierDetail(response);
};

function invalidatePricingMatrixLaborTiers(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: pricingMatrixLaborTierKeys.all,
  });
}

export const createPricingMatrixLaborTierMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: PricingMatrixLaborTierCreateDto) =>
      createPricingMatrixLaborTier(body),
    meta: { feature: 'pricing-matrix-labor-tier', operation: 'create' },
    onSuccess: () => invalidatePricingMatrixLaborTiers(queryClient),
  });

export const updatePricingMatrixLaborTierMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: PricingMatrixLaborTierUpdateDto;
    }) => updatePricingMatrixLaborTier(id, body),
    meta: { feature: 'pricing-matrix-labor-tier', operation: 'update' },
    onSuccess: () => invalidatePricingMatrixLaborTiers(queryClient),
  });

export const patchPricingMatrixLaborTierMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: PricingMatrixLaborTierPatchDto;
    }) => patchPricingMatrixLaborTier(id, body),
    meta: { feature: 'pricing-matrix-labor-tier', operation: 'patch' },
    onSuccess: () => invalidatePricingMatrixLaborTiers(queryClient),
  });
