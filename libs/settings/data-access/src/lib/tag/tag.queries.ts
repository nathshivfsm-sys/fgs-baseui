import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  tagDetailResponseSchema,
  tagListResponseSchema,
  tagLookupResponseSchema,
  type PagedResult,
  type TagDetailDto,
  type TagListParams,
  type TagLookupDto,
  type TagSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  tagDetailEndpoint,
  tagListEndpoint,
  tagLookupEndpoint,
} from './tag.endpoints';
import { tagKeys } from './tag.keys';

export const loadTags = async (
  params: TagListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<TagSummaryDto>> => {
  const body = await customFetch<unknown>(tagListEndpoint(params), {
    signal,
  });
  return toPagedResult(tagListResponseSchema.parse(body).data);
};

export const loadTag = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<TagDetailDto> => {
  const body = await customFetch<unknown>(tagDetailEndpoint(id), {
    signal,
  });
  return tagDetailResponseSchema.parse(body).data;
};

export const loadTagLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly TagLookupDto[]> => {
  const body = await customFetch<unknown>(tagLookupEndpoint(activeOnly), {
    signal,
  });
  return tagLookupResponseSchema.parse(body).data;
};

export const tagListQueryOptions = (params: TagListParams = {}) =>
  queryOptions({
    queryKey: tagKeys.list(params),
    queryFn: ({ signal }) => loadTags(params, { signal }),
    meta: { feature: 'tag', operation: 'list' },
  });

export const tagDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: tagKeys.detail(id),
    queryFn: ({ signal }) => loadTag(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tag', operation: 'detail' },
  });

export const tagLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: tagKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadTagLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tag', operation: 'lookup' },
  });
