import type { CustomerListParams } from '@cms/lead-contract';

export const customerKeys = {
  all: ['customer'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params: CustomerListParams = {}) =>
    [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
  lookups: () => [...customerKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...customerKeys.lookups(), { activeOnly }] as const,
} as const;
