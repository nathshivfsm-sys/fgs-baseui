import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  priceBookItemDetailResponseSchema,
  priceBookItemListResponseSchema,
  priceBookItemLookupResponseSchema,
  type PagedResult,
  type PriceBookItemDetailDto,
  type PriceBookItemListParams,
  type PriceBookItemLookupDto,
  type PriceBookItemLookupParams,
  type PriceBookItemSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  priceBookItemDetailEndpoint,
  priceBookItemListEndpoint,
  priceBookItemLookupEndpoint,
} from './price-book-item.endpoints';
import { priceBookItemKeys } from './price-book-item.keys';

export const loadPriceBookItems = async (
  params: PriceBookItemListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PriceBookItemSummaryDto>> => {
  const body = await customFetch<unknown>(priceBookItemListEndpoint(params), {
    signal,
  });
  return toPagedResult(priceBookItemListResponseSchema.parse(body).data);
};

export const loadPriceBookItem = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PriceBookItemDetailDto> => {
  const body = await customFetch<unknown>(priceBookItemDetailEndpoint(id), {
    signal,
  });
  return priceBookItemDetailResponseSchema.parse(body).data;
};

export const loadPriceBookItemLookup = async (
  params: PriceBookItemLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly PriceBookItemLookupDto[]> => {
  const body = await customFetch<unknown>(priceBookItemLookupEndpoint(params), {
    signal,
  });
  return priceBookItemLookupResponseSchema.parse(body).data;
};

export const priceBookItemListQueryOptions = (
  params: PriceBookItemListParams = {},
) =>
  queryOptions({
    queryKey: priceBookItemKeys.list(params),
    queryFn: ({ signal }) => loadPriceBookItems(params, { signal }),
    meta: { feature: 'price-book-item', operation: 'list' },
  });

export const priceBookItemDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: priceBookItemKeys.detail(id),
    queryFn: ({ signal }) => loadPriceBookItem(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'price-book-item', operation: 'detail' },
  });

export const priceBookItemLookupQueryOptions = (
  params: PriceBookItemLookupParams = {},
) =>
  queryOptions({
    queryKey: priceBookItemKeys.lookup(params),
    queryFn: ({ signal }) => loadPriceBookItemLookup(params, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'price-book-item', operation: 'lookup' },
  });
