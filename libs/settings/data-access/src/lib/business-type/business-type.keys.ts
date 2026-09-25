import type { BusinessTypeListParams } from '@cms/settings-contract';

export const businessTypeKeys = {
  all: ['business-type'] as const,
  lists: () => [...businessTypeKeys.all, 'list'] as const,
  list: (params: BusinessTypeListParams = {}) =>
    [...businessTypeKeys.lists(), params] as const,
  details: () => [...businessTypeKeys.all, 'detail'] as const,
  detail: (id: number) => [...businessTypeKeys.details(), id] as const,
  lookups: () => [...businessTypeKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...businessTypeKeys.lookups(), { activeOnly }] as const,
} as const;
