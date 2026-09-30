import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  jobTypeCountsResponseSchema,
  jobTypeDetailResponseSchema,
  jobTypeListResponseSchema,
  jobTypeLookupResponseSchema,
  type JobTypeCountsDto,
  type JobTypeCountsParams,
  type JobTypeDetailDto,
  type JobTypeListParams,
  type JobTypeLookupDto,
  type JobTypeSummaryDto,
  type PagedResult,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  jobTypeCountsEndpoint,
  jobTypeDetailEndpoint,
  jobTypeListEndpoint,
  jobTypeLookupEndpoint,
} from './job-type.endpoints';
import { jobTypeKeys } from './job-type.keys';

export const loadJobTypes = async (
  params: JobTypeListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<JobTypeSummaryDto>> => {
  const body = await customFetch<unknown>(jobTypeListEndpoint(params), {
    signal,
  });
  return toPagedResult(jobTypeListResponseSchema.parse(body).data);
};

export const loadJobType = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<JobTypeDetailDto> => {
  const body = await customFetch<unknown>(jobTypeDetailEndpoint(id), {
    signal,
  });
  return jobTypeDetailResponseSchema.parse(body).data;
};

export const loadJobTypeLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly JobTypeLookupDto[]> => {
  const body = await customFetch<unknown>(jobTypeLookupEndpoint(activeOnly), {
    signal,
  });
  return jobTypeLookupResponseSchema.parse(body).data;
};

export const loadJobTypeCounts = async (
  params: JobTypeCountsParams,
  { signal }: QueryRequestContext,
): Promise<JobTypeCountsDto> => {
  const body = await customFetch<unknown>(jobTypeCountsEndpoint(params), {
    signal,
  });
  return jobTypeCountsResponseSchema.parse(body).data;
};

export const jobTypeListQueryOptions = (params: JobTypeListParams = {}) =>
  queryOptions({
    queryKey: jobTypeKeys.list(params),
    queryFn: ({ signal }) => loadJobTypes(params, { signal }),
    meta: { feature: 'job-type', operation: 'list' },
  });

export const jobTypeDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: jobTypeKeys.detail(id),
    queryFn: ({ signal }) => loadJobType(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'job-type', operation: 'detail' },
  });

export const jobTypeLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: jobTypeKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadJobTypeLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'job-type', operation: 'lookup' },
  });

export const jobTypeCountsQueryOptions = (params: JobTypeCountsParams = {}) =>
  queryOptions({
    queryKey: jobTypeKeys.counts(params),
    queryFn: ({ signal }) => loadJobTypeCounts(params, { signal }),
    meta: { feature: 'job-type', operation: 'counts' },
  });
