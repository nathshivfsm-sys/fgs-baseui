import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  salesPipelineStatusDetailResponseSchema,
  salesPipelineStatusListResponseSchema,
  salesPipelineStatusLookupResponseSchema,
  type PagedResult,
  type SalesPipelineStatusDetailDto,
  type SalesPipelineStatusListParams,
  type SalesPipelineStatusLookupDto,
  type SalesPipelineStatusSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  salesPipelineStatusDetailEndpoint,
  salesPipelineStatusListEndpoint,
  salesPipelineStatusLookupEndpoint,
} from './sales-pipeline-status.endpoints';
import { salesPipelineStatusKeys } from './sales-pipeline-status.keys';

export const loadSalesPipelineStatuses = async (
  params: SalesPipelineStatusListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<SalesPipelineStatusSummaryDto>> => {
  const body = await customFetch<unknown>(
    salesPipelineStatusListEndpoint(params),
    { signal },
  );
  return toPagedResult(salesPipelineStatusListResponseSchema.parse(body).data);
};

export const loadSalesPipelineStatus = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<SalesPipelineStatusDetailDto> => {
  const body = await customFetch<unknown>(
    salesPipelineStatusDetailEndpoint(id),
    { signal },
  );
  return salesPipelineStatusDetailResponseSchema.parse(body).data;
};

export const loadSalesPipelineStatusLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly SalesPipelineStatusLookupDto[]> => {
  const body = await customFetch<unknown>(
    salesPipelineStatusLookupEndpoint(activeOnly),
    { signal },
  );
  return salesPipelineStatusLookupResponseSchema.parse(body).data;
};

export const salesPipelineStatusListQueryOptions = (
  params: SalesPipelineStatusListParams = {},
) =>
  queryOptions({
    queryKey: salesPipelineStatusKeys.list(params),
    queryFn: ({ signal }) => loadSalesPipelineStatuses(params, { signal }),
    meta: { feature: 'sales-pipeline-status', operation: 'list' },
  });

export const salesPipelineStatusDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: salesPipelineStatusKeys.detail(id),
    queryFn: ({ signal }) => loadSalesPipelineStatus(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'sales-pipeline-status', operation: 'detail' },
  });

export const salesPipelineStatusLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: salesPipelineStatusKeys.lookup(activeOnly),
    queryFn: ({ signal }) =>
      loadSalesPipelineStatusLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'sales-pipeline-status', operation: 'lookup' },
  });
