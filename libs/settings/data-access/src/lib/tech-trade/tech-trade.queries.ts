import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  techTradeDetailResponseSchema,
  techTradeListResponseSchema,
  techTradeLookupResponseSchema,
  type PagedResult,
  type TechTradeDetailDto,
  type TechTradeListParams,
  type TechTradeLookupDto,
  type TechTradeSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  techTradeDetailEndpoint,
  techTradeListEndpoint,
  techTradeLookupEndpoint,
} from './tech-trade.endpoints';
import { techTradeKeys } from './tech-trade.keys';

export const loadTechTrades = async (
  params: TechTradeListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<TechTradeSummaryDto>> => {
  const body = await customFetch<unknown>(techTradeListEndpoint(params), {
    signal,
  });
  return toPagedResult(techTradeListResponseSchema.parse(body).data);
};

export const loadTechTrade = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<TechTradeDetailDto> => {
  const body = await customFetch<unknown>(techTradeDetailEndpoint(id), {
    signal,
  });
  return techTradeDetailResponseSchema.parse(body).data;
};

export const loadTechTradeLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly TechTradeLookupDto[]> => {
  const body = await customFetch<unknown>(techTradeLookupEndpoint(activeOnly), {
    signal,
  });
  return techTradeLookupResponseSchema.parse(body).data;
};

export const techTradeListQueryOptions = (params: TechTradeListParams = {}) =>
  queryOptions({
    queryKey: techTradeKeys.list(params),
    queryFn: ({ signal }) => loadTechTrades(params, { signal }),
    meta: { feature: 'tech-trade', operation: 'list' },
  });

export const techTradeDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: techTradeKeys.detail(id),
    queryFn: ({ signal }) => loadTechTrade(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tech-trade', operation: 'detail' },
  });

export const techTradeLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: techTradeKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadTechTradeLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tech-trade', operation: 'lookup' },
  });
