import type { TaxListParams } from '@cms/settings-contract';

export const taxKeys = {
  all: ['tax'] as const,
  lists: () => [...taxKeys.all, 'list'] as const,
  list: (params: TaxListParams = {}) => [...taxKeys.lists(), params] as const,
  details: () => [...taxKeys.all, 'detail'] as const,
  detail: (id: number) => [...taxKeys.details(), id] as const,
  lookups: () => [...taxKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...taxKeys.lookups(), { activeOnly }] as const,
} as const;
