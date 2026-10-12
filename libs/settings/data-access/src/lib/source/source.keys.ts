import type { SourceListParams } from '@cms/settings-contract';

export const sourceKeys = {
  all: ['source'] as const,
  lists: () => [...sourceKeys.all, 'list'] as const,
  list: (params: SourceListParams = {}) =>
    [...sourceKeys.lists(), params] as const,
  details: () => [...sourceKeys.all, 'detail'] as const,
  detail: (id: number) => [...sourceKeys.details(), id] as const,
  lookups: () => [...sourceKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...sourceKeys.lookups(), { activeOnly }] as const,
} as const;
