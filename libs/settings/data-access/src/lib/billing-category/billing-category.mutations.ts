import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  billingCategoryDetailResponseSchema,
  type BillingCategoryCreateDto,
  type BillingCategoryDetailDto,
  type BillingCategoryPatchDto,
  type BillingCategoryUpdateDto,
} from '@cms/settings-contract';
import {
  billingCategoryCollectionEndpoint,
  billingCategoryDetailEndpoint,
} from './billing-category.endpoints';
import { billingCategoryKeys } from './billing-category.keys';

async function parseBillingCategoryDetail(
  body: unknown,
): Promise<BillingCategoryDetailDto> {
  return billingCategoryDetailResponseSchema.parse(body).data;
}

export const createBillingCategory = async (
  body: BillingCategoryCreateDto,
  context?: QueryRequestContext,
): Promise<BillingCategoryDetailDto> => {
  const response = await customFetch<unknown>(billingCategoryCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseBillingCategoryDetail(response);
};

export const updateBillingCategory = async (
  id: number,
  body: BillingCategoryUpdateDto,
  context?: QueryRequestContext,
): Promise<BillingCategoryDetailDto> => {
  const response = await customFetch<unknown>(billingCategoryDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseBillingCategoryDetail(response);
};

export const patchBillingCategory = async (
  id: number,
  body: BillingCategoryPatchDto,
  context?: QueryRequestContext,
): Promise<BillingCategoryDetailDto> => {
  const response = await customFetch<unknown>(billingCategoryDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseBillingCategoryDetail(response);
};

function invalidateBillingCategories(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: billingCategoryKeys.all });
}

export const createBillingCategoryMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: BillingCategoryCreateDto) => createBillingCategory(body),
    meta: { feature: 'billing-category', operation: 'create' },
    onSuccess: () => invalidateBillingCategories(queryClient),
  });

export const updateBillingCategoryMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: BillingCategoryUpdateDto;
    }) => updateBillingCategory(id, body),
    meta: { feature: 'billing-category', operation: 'update' },
    onSuccess: () => invalidateBillingCategories(queryClient),
  });

export const patchBillingCategoryMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: BillingCategoryPatchDto;
    }) => patchBillingCategory(id, body),
    meta: { feature: 'billing-category', operation: 'patch' },
    onSuccess: () => invalidateBillingCategories(queryClient),
  });
