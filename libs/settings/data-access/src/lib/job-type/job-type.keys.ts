import type {
  JobTypeCountsParams,
  JobTypeListParams,
} from '@cms/settings-contract';

export const jobTypeKeys = {
  all: ['job-type'] as const,
  lists: () => [...jobTypeKeys.all, 'list'] as const,
  list: (params: JobTypeListParams = {}) =>
    [...jobTypeKeys.lists(), params] as const,
  details: () => [...jobTypeKeys.all, 'detail'] as const,
  detail: (id: number) => [...jobTypeKeys.details(), id] as const,
  lookups: () => [...jobTypeKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...jobTypeKeys.lookups(), { activeOnly }] as const,
  counts: (params: JobTypeCountsParams = {}) =>
    [...jobTypeKeys.all, 'counts', params] as const,
} as const;
