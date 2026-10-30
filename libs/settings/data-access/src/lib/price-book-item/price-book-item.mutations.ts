import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  priceBookItemDetailResponseSchema,
  type PriceBookItemCreateDto,
  type PriceBookItemDetailDto,
  type PriceBookItemPatchDto,
  type PriceBookItemUpdateDto,
} from '@cms/settings-contract';
import {
  priceBookItemCollectionEndpoint,
  priceBookItemDetailEndpoint,
} from './price-book-item.endpoints';
import { priceBookItemKeys } from './price-book-item.keys';

async function parsePriceBookItemDetail(
  body: unknown,
): Promise<PriceBookItemDetailDto> {
  return priceBookItemDetailResponseSchema.parse(body).data;
}

export const createPriceBookItem = async (
  body: PriceBookItemCreateDto,
  context?: QueryRequestContext,
): Promise<PriceBookItemDetailDto> => {
  const response = await customFetch<unknown>(priceBookItemCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePriceBookItemDetail(response);
};

export const updatePriceBookItem = async (
  id: number,
  body: PriceBookItemUpdateDto,
  context?: QueryRequestContext,
): Promise<PriceBookItemDetailDto> => {
  const response = await customFetch<unknown>(priceBookItemDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePriceBookItemDetail(response);
};

export const patchPriceBookItem = async (
  id: number,
  body: PriceBookItemPatchDto,
  context?: QueryRequestContext,
): Promise<PriceBookItemDetailDto> => {
  const response = await customFetch<unknown>(priceBookItemDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePriceBookItemDetail(response);
};

export const deletePriceBookItem = async (
  id: number,
  context?: QueryRequestContext,
): Promise<void> => {
  await customFetch<unknown>(priceBookItemDetailEndpoint(id), {
    method: 'DELETE',
    signal: context?.signal,
  });
};

function invalidatePriceBookItems(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: priceBookItemKeys.all });
}

export const createPriceBookItemMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: PriceBookItemCreateDto) => createPriceBookItem(body),
    meta: { feature: 'price-book-item', operation: 'create' },
    onSuccess: () => invalidatePriceBookItems(queryClient),
  });

export const updatePriceBookItemMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PriceBookItemUpdateDto }) =>
      updatePriceBookItem(id, body),
    meta: { feature: 'price-book-item', operation: 'update' },
    onSuccess: () => invalidatePriceBookItems(queryClient),
  });

export const patchPriceBookItemMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PriceBookItemPatchDto }) =>
      patchPriceBookItem(id, body),
    meta: { feature: 'price-book-item', operation: 'patch' },
    onSuccess: () => invalidatePriceBookItems(queryClient),
  });

export const deletePriceBookItemMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (id: number) => deletePriceBookItem(id),
    meta: { feature: 'price-book-item', operation: 'delete' },
    onSuccess: () => invalidatePriceBookItems(queryClient),
  });
