import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  glBreakDetailResponseSchema,
  glBreakListResponseSchema,
  type GlBreakDetailDto,
  type GlBreakListParams,
  type GlBreakSummaryDto,
  type PagedResult,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  glBreakDetailEndpoint,
  glBreakListEndpoint,
} from './gl-break.endpoints';
import { glBreakKeys } from './gl-break.keys';

export const loadGlBreaks = async (
  params: GlBreakListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<GlBreakSummaryDto>> => {
  const body = await customFetch<unknown>(glBreakListEndpoint(params), {
    signal,
  });
  return toPagedResult(glBreakListResponseSchema.parse(body).data);
};

export const loadGlBreak = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<GlBreakDetailDto> => {
  const body = await customFetch<unknown>(glBreakDetailEndpoint(id), {
    signal,
  });
  return glBreakDetailResponseSchema.parse(body).data;
};

export const glBreakListQueryOptions = (params: GlBreakListParams = {}) =>
  queryOptions({
    queryKey: glBreakKeys.list(params),
    queryFn: ({ signal }) => loadGlBreaks(params, { signal }),
    meta: { feature: 'gl-break', operation: 'list' },
  });

export const glBreakDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: glBreakKeys.detail(id),
    queryFn: ({ signal }) => loadGlBreak(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'gl-break', operation: 'detail' },
  });
