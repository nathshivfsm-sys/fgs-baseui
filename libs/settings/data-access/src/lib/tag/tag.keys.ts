import type { TagListParams } from '@cms/settings-contract';

export const tagKeys = {
  all: ['tag'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (params: TagListParams = {}) => [...tagKeys.lists(), params] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: number) => [...tagKeys.details(), id] as const,
  lookups: () => [...tagKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...tagKeys.lookups(), { activeOnly }] as const,
} as const;
