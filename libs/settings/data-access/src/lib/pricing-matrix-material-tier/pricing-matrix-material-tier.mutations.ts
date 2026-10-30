import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixMaterialTierDetailResponseSchema,
  type PricingMatrixMaterialTierCreateDto,
  type PricingMatrixMaterialTierDetailDto,
  type PricingMatrixMaterialTierPatchDto,
  type PricingMatrixMaterialTierUpdateDto,
} from '@cms/settings-contract';
import {
  pricingMatrixMaterialTierCollectionEndpoint,
  pricingMatrixMaterialTierDetailEndpoint,
} from './pricing-matrix-material-tier.endpoints';
import { pricingMatrixMaterialTierKeys } from './pricing-matrix-material-tier.keys';

async function parsePricingMatrixMaterialTierDetail(
  body: unknown,
): Promise<PricingMatrixMaterialTierDetailDto> {
  return pricingMatrixMaterialTierDetailResponseSchema.parse(body).data;
}

export const createPricingMatrixMaterialTier = async (
  body: PricingMatrixMaterialTierCreateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixMaterialTierDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixMaterialTierCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixMaterialTierDetail(response);
};

export const updatePricingMatrixMaterialTier = async (
  id: number,
  body: PricingMatrixMaterialTierUpdateDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixMaterialTierDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixMaterialTierDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixMaterialTierDetail(response);
};

export const patchPricingMatrixMaterialTier = async (
  id: number,
  body: PricingMatrixMaterialTierPatchDto,
  context?: QueryRequestContext,
): Promise<PricingMatrixMaterialTierDetailDto> => {
  const response = await customFetch<unknown>(
    pricingMatrixMaterialTierDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parsePricingMatrixMaterialTierDetail(response);
};

function invalidatePricingMatrixMaterialTiers(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: pricingMatrixMaterialTierKeys.all,
  });
}

export const createPricingMatrixMaterialTierMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: PricingMatrixMaterialTierCreateDto) =>
      createPricingMatrixMaterialTier(body),
    meta: { feature: 'pricing-matrix-material-tier', operation: 'create' },
    onSuccess: () => invalidatePricingMatrixMaterialTiers(queryClient),
  });

export const updatePricingMatrixMaterialTierMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: PricingMatrixMaterialTierUpdateDto;
    }) => updatePricingMatrixMaterialTier(id, body),
    meta: { feature: 'pricing-matrix-material-tier', operation: 'update' },
    onSuccess: () => invalidatePricingMatrixMaterialTiers(queryClient),
  });

export const patchPricingMatrixMaterialTierMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: PricingMatrixMaterialTierPatchDto;
    }) => patchPricingMatrixMaterialTier(id, body),
    meta: { feature: 'pricing-matrix-material-tier', operation: 'patch' },
    onSuccess: () => invalidatePricingMatrixMaterialTiers(queryClient),
  });
