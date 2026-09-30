import type { JobCategoryListParams } from '@cms/settings-contract';

export const jobCategoryKeys = {
  all: ['job-category'] as const,
  lists: () => [...jobCategoryKeys.all, 'list'] as const,
  list: (params: JobCategoryListParams = {}) =>
    [...jobCategoryKeys.lists(), params] as const,
  details: () => [...jobCategoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...jobCategoryKeys.details(), id] as const,
  lookups: () => [...jobCategoryKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...jobCategoryKeys.lookups(), { activeOnly }] as const,
} as const;
