import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  priceBookDetailResponseSchema,
  priceBookListResponseSchema,
  priceBookLookupResponseSchema,
  type PagedResult,
  type PriceBookDetailDto,
  type PriceBookListParams,
  type PriceBookLookupDto,
  type PriceBookSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  priceBookDetailEndpoint,
  priceBookListEndpoint,
  priceBookLookupEndpoint,
} from './price-book.endpoints';
import { priceBookKeys } from './price-book.keys';

export const loadPriceBooks = async (
  params: PriceBookListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PriceBookSummaryDto>> => {
  const body = await customFetch<unknown>(priceBookListEndpoint(params), {
    signal,
  });
  return toPagedResult(priceBookListResponseSchema.parse(body).data);
};

export const loadPriceBook = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PriceBookDetailDto> => {
  const body = await customFetch<unknown>(priceBookDetailEndpoint(id), {
    signal,
  });
  return priceBookDetailResponseSchema.parse(body).data;
};

export const loadPriceBookLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly PriceBookLookupDto[]> => {
  const body = await customFetch<unknown>(priceBookLookupEndpoint(activeOnly), {
    signal,
  });
  return priceBookLookupResponseSchema.parse(body).data;
};

export const priceBookListQueryOptions = (params: PriceBookListParams = {}) =>
  queryOptions({
    queryKey: priceBookKeys.list(params),
    queryFn: ({ signal }) => loadPriceBooks(params, { signal }),
    meta: { feature: 'price-book', operation: 'list' },
  });

export const priceBookDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: priceBookKeys.detail(id),
    queryFn: ({ signal }) => loadPriceBook(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'price-book', operation: 'detail' },
  });

export const priceBookLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: priceBookKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadPriceBookLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'price-book', operation: 'lookup' },
  });
