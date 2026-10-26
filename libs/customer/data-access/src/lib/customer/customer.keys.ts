import type { CustomerListParams } from '@cms/customer-contract';

export const customerKeys = {
  all: ['customer'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params: CustomerListParams = {}) =>
    [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
  financialSummaries: () => [...customerKeys.all, 'financial-summary'] as const,
  financialSummary: (id: number) =>
    [...customerKeys.financialSummaries(), id] as const,
  lookups: () => [...customerKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...customerKeys.lookups(), { activeOnly }] as const,
} as const;
