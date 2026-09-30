import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  subcategoryDetailResponseSchema,
  type SubcategoryCreateDto,
  type SubcategoryDetailDto,
  type SubcategoryPatchDto,
  type SubcategoryUpdateDto,
} from '@cms/settings-contract';
import {
  subcategoryCollectionEndpoint,
  subcategoryDetailEndpoint,
} from './subcategory.endpoints';
import { subcategoryKeys } from './subcategory.keys';

async function parseSubcategoryDetail(
  body: unknown,
): Promise<SubcategoryDetailDto> {
  return subcategoryDetailResponseSchema.parse(body).data;
}

export const createSubcategory = async (
  body: SubcategoryCreateDto,
  context?: QueryRequestContext,
): Promise<SubcategoryDetailDto> => {
  const response = await customFetch<unknown>(subcategoryCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseSubcategoryDetail(response);
};

export const updateSubcategory = async (
  id: number,
  body: SubcategoryUpdateDto,
  context?: QueryRequestContext,
): Promise<SubcategoryDetailDto> => {
  const response = await customFetch<unknown>(subcategoryDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseSubcategoryDetail(response);
};

export const patchSubcategory = async (
  id: number,
  body: SubcategoryPatchDto,
  context?: QueryRequestContext,
): Promise<SubcategoryDetailDto> => {
  const response = await customFetch<unknown>(subcategoryDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseSubcategoryDetail(response);
};

function invalidateSubcategories(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: subcategoryKeys.all });
}

export const createSubcategoryMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: SubcategoryCreateDto) => createSubcategory(body),
    meta: { feature: 'subcategory', operation: 'create' },
    onSuccess: () => invalidateSubcategories(queryClient),
  });

export const updateSubcategoryMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: SubcategoryUpdateDto }) =>
      updateSubcategory(id, body),
    meta: { feature: 'subcategory', operation: 'update' },
    onSuccess: () => invalidateSubcategories(queryClient),
  });

export const patchSubcategoryMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: SubcategoryPatchDto }) =>
      patchSubcategory(id, body),
    meta: { feature: 'subcategory', operation: 'patch' },
    onSuccess: () => invalidateSubcategories(queryClient),
  });
