import type { SalesActivityTypeListParams } from '@cms/settings-contract';

export const salesActivityTypeKeys = {
  all: ['sales-activity-type'] as const,
  lists: () => [...salesActivityTypeKeys.all, 'list'] as const,
  list: (params: SalesActivityTypeListParams = {}) =>
    [...salesActivityTypeKeys.lists(), params] as const,
  details: () => [...salesActivityTypeKeys.all, 'detail'] as const,
  detail: (id: number) => [...salesActivityTypeKeys.details(), id] as const,
  lookups: () => [...salesActivityTypeKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...salesActivityTypeKeys.lookups(), { activeOnly }] as const,
} as const;
