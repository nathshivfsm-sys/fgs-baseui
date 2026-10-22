import type { SalesActivityOutcomeListParams } from '@cms/settings-contract';

export const salesActivityOutcomeKeys = {
  all: ['sales-activity-outcome'] as const,
  lists: () => [...salesActivityOutcomeKeys.all, 'list'] as const,
  list: (params: SalesActivityOutcomeListParams = {}) =>
    [...salesActivityOutcomeKeys.lists(), params] as const,
  details: () => [...salesActivityOutcomeKeys.all, 'detail'] as const,
  detail: (id: number) => [...salesActivityOutcomeKeys.details(), id] as const,
  lookups: () => [...salesActivityOutcomeKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...salesActivityOutcomeKeys.lookups(), { activeOnly }] as const,
} as const;
