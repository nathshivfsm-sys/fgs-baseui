import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  sourceDetailResponseSchema,
  sourceListResponseSchema,
  sourceLookupResponseSchema,
  type PagedResult,
  type SourceDetailDto,
  type SourceListParams,
  type SourceLookupDto,
  type SourceSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  sourceDetailEndpoint,
  sourceListEndpoint,
  sourceLookupEndpoint,
} from './source.endpoints';
import { sourceKeys } from './source.keys';

export const loadSources = async (
  params: SourceListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<SourceSummaryDto>> => {
  const body = await customFetch<unknown>(sourceListEndpoint(params), {
    signal,
  });
  return toPagedResult(sourceListResponseSchema.parse(body).data);
};

export const loadSource = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<SourceDetailDto> => {
  const body = await customFetch<unknown>(sourceDetailEndpoint(id), {
    signal,
  });
  return sourceDetailResponseSchema.parse(body).data;
};

export const loadSourceLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly SourceLookupDto[]> => {
  const body = await customFetch<unknown>(sourceLookupEndpoint(activeOnly), {
    signal,
  });
  return sourceLookupResponseSchema.parse(body).data;
};

export const sourceListQueryOptions = (params: SourceListParams = {}) =>
  queryOptions({
    queryKey: sourceKeys.list(params),
    queryFn: ({ signal }) => loadSources(params, { signal }),
    meta: { feature: 'source', operation: 'list' },
  });

export const sourceDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: sourceKeys.detail(id),
    queryFn: ({ signal }) => loadSource(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'source', operation: 'detail' },
  });

export const sourceLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: sourceKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadSourceLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'source', operation: 'lookup' },
  });
