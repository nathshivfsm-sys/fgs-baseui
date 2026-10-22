import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  salesActivityTypeDetailResponseSchema,
  salesActivityTypeListResponseSchema,
  salesActivityTypeLookupResponseSchema,
  type PagedResult,
  type SalesActivityTypeDetailDto,
  type SalesActivityTypeListParams,
  type SalesActivityTypeLookupDto,
  type SalesActivityTypeSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  salesActivityTypeDetailEndpoint,
  salesActivityTypeListEndpoint,
  salesActivityTypeLookupEndpoint,
} from './sales-activity-type.endpoints';
import { salesActivityTypeKeys } from './sales-activity-type.keys';

export const loadSalesActivityTypes = async (
  params: SalesActivityTypeListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<SalesActivityTypeSummaryDto>> => {
  const body = await customFetch<unknown>(
    salesActivityTypeListEndpoint(params),
    {
      signal,
    },
  );
  return toPagedResult(salesActivityTypeListResponseSchema.parse(body).data);
};

export const loadSalesActivityType = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<SalesActivityTypeDetailDto> => {
  const body = await customFetch<unknown>(salesActivityTypeDetailEndpoint(id), {
    signal,
  });
  return salesActivityTypeDetailResponseSchema.parse(body).data;
};

export const loadSalesActivityTypeLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly SalesActivityTypeLookupDto[]> => {
  const body = await customFetch<unknown>(
    salesActivityTypeLookupEndpoint(activeOnly),
    { signal },
  );
  return salesActivityTypeLookupResponseSchema.parse(body).data;
};

export const salesActivityTypeListQueryOptions = (
  params: SalesActivityTypeListParams = {},
) =>
  queryOptions({
    queryKey: salesActivityTypeKeys.list(params),
    queryFn: ({ signal }) => loadSalesActivityTypes(params, { signal }),
    meta: { feature: 'sales-activity-type', operation: 'list' },
  });

export const salesActivityTypeDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: salesActivityTypeKeys.detail(id),
    queryFn: ({ signal }) => loadSalesActivityType(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'sales-activity-type', operation: 'detail' },
  });

export const salesActivityTypeLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: salesActivityTypeKeys.lookup(activeOnly),
    queryFn: ({ signal }) =>
      loadSalesActivityTypeLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'sales-activity-type', operation: 'lookup' },
  });
