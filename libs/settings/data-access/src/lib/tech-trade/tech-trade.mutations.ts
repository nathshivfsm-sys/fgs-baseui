import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  techTradeDetailResponseSchema,
  type TechTradeCreateDto,
  type TechTradeDetailDto,
  type TechTradePatchDto,
  type TechTradeUpdateDto,
} from '@cms/settings-contract';
import {
  techTradeCollectionEndpoint,
  techTradeDetailEndpoint,
} from './tech-trade.endpoints';
import { techTradeKeys } from './tech-trade.keys';

async function parseTechTradeDetail(body: unknown): Promise<TechTradeDetailDto> {
  return techTradeDetailResponseSchema.parse(body).data;
}

export const createTechTrade = async (
  body: TechTradeCreateDto,
  context?: QueryRequestContext,
): Promise<TechTradeDetailDto> => {
  const response = await customFetch<unknown>(techTradeCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTechTradeDetail(response);
};

export const updateTechTrade = async (
  id: number,
  body: TechTradeUpdateDto,
  context?: QueryRequestContext,
): Promise<TechTradeDetailDto> => {
  const response = await customFetch<unknown>(techTradeDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTechTradeDetail(response);
};

export const patchTechTrade = async (
  id: number,
  body: TechTradePatchDto,
  context?: QueryRequestContext,
): Promise<TechTradeDetailDto> => {
  const response = await customFetch<unknown>(techTradeDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTechTradeDetail(response);
};

export const deleteTechTrade = async (
  id: number,
  context?: QueryRequestContext,
): Promise<void> => {
  await customFetch<unknown>(techTradeDetailEndpoint(id), {
    method: 'DELETE',
    signal: context?.signal,
  });
};

function invalidateTechTrades(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: techTradeKeys.all });
}

export const createTechTradeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: TechTradeCreateDto) => createTechTrade(body),
    meta: { feature: 'tech-trade', operation: 'create' },
    onSuccess: () => invalidateTechTrades(queryClient),
  });

export const updateTechTradeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TechTradeUpdateDto }) =>
      updateTechTrade(id, body),
    meta: { feature: 'tech-trade', operation: 'update' },
    onSuccess: () => invalidateTechTrades(queryClient),
  });

export const patchTechTradeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TechTradePatchDto }) =>
      patchTechTrade(id, body),
    meta: { feature: 'tech-trade', operation: 'patch' },
    onSuccess: () => invalidateTechTrades(queryClient),
  });

export const deleteTechTradeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (id: number) => deleteTechTrade(id),
    meta: { feature: 'tech-trade', operation: 'delete' },
    onSuccess: () => invalidateTechTrades(queryClient),
  });
