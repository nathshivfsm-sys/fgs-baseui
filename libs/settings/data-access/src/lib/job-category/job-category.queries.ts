import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  jobCategoryDetailResponseSchema,
  jobCategoryListResponseSchema,
  jobCategoryLookupResponseSchema,
  type JobCategoryDetailDto,
  type JobCategoryListParams,
  type JobCategoryLookupDto,
  type JobCategorySummaryDto,
  type PagedResult,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  jobCategoryDetailEndpoint,
  jobCategoryListEndpoint,
  jobCategoryLookupEndpoint,
} from './job-category.endpoints';
import { jobCategoryKeys } from './job-category.keys';

export const loadJobCategories = async (
  params: JobCategoryListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<JobCategorySummaryDto>> => {
  const body = await customFetch<unknown>(jobCategoryListEndpoint(params), {
    signal,
  });
  return toPagedResult(jobCategoryListResponseSchema.parse(body).data);
};

export const loadJobCategory = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<JobCategoryDetailDto> => {
  const body = await customFetch<unknown>(jobCategoryDetailEndpoint(id), {
    signal,
  });
  return jobCategoryDetailResponseSchema.parse(body).data;
};

export const loadJobCategoryLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly JobCategoryLookupDto[]> => {
  const body = await customFetch<unknown>(
    jobCategoryLookupEndpoint(activeOnly),
    { signal },
  );
  return jobCategoryLookupResponseSchema.parse(body).data;
};

export const jobCategoryListQueryOptions = (
  params: JobCategoryListParams = {},
) =>
  queryOptions({
    queryKey: jobCategoryKeys.list(params),
    queryFn: ({ signal }) => loadJobCategories(params, { signal }),
    meta: { feature: 'job-category', operation: 'list' },
  });

export const jobCategoryDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: jobCategoryKeys.detail(id),
    queryFn: ({ signal }) => loadJobCategory(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'job-category', operation: 'detail' },
  });

export const jobCategoryLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: jobCategoryKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadJobCategoryLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'job-category', operation: 'lookup' },
  });
