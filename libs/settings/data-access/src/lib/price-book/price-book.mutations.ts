import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  priceBookDetailResponseSchema,
  type PriceBookCreateDto,
  type PriceBookDetailDto,
  type PriceBookPatchDto,
  type PriceBookUpdateDto,
} from '@cms/settings-contract';
import {
  priceBookCollectionEndpoint,
  priceBookDetailEndpoint,
} from './price-book.endpoints';
import { priceBookKeys } from './price-book.keys';

async function parsePriceBookDetail(
  body: unknown,
): Promise<PriceBookDetailDto> {
  return priceBookDetailResponseSchema.parse(body).data;
}

export const createPriceBook = async (
  body: PriceBookCreateDto,
  context?: QueryRequestContext,
): Promise<PriceBookDetailDto> => {
  const response = await customFetch<unknown>(priceBookCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePriceBookDetail(response);
};

export const updatePriceBook = async (
  id: number,
  body: PriceBookUpdateDto,
  context?: QueryRequestContext,
): Promise<PriceBookDetailDto> => {
  const response = await customFetch<unknown>(priceBookDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePriceBookDetail(response);
};

export const patchPriceBook = async (
  id: number,
  body: PriceBookPatchDto,
  context?: QueryRequestContext,
): Promise<PriceBookDetailDto> => {
  const response = await customFetch<unknown>(priceBookDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePriceBookDetail(response);
};

function invalidatePriceBooks(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: priceBookKeys.all });
}

export const createPriceBookMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: PriceBookCreateDto) => createPriceBook(body),
    meta: { feature: 'price-book', operation: 'create' },
    onSuccess: () => invalidatePriceBooks(queryClient),
  });

export const updatePriceBookMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PriceBookUpdateDto }) =>
      updatePriceBook(id, body),
    meta: { feature: 'price-book', operation: 'update' },
    onSuccess: () => invalidatePriceBooks(queryClient),
  });

export const patchPriceBookMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PriceBookPatchDto }) =>
      patchPriceBook(id, body),
    meta: { feature: 'price-book', operation: 'patch' },
    onSuccess: () => invalidatePriceBooks(queryClient),
  });
