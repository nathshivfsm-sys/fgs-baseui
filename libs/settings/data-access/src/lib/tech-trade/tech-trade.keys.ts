import type { TechTradeListParams } from '@cms/settings-contract';

export const techTradeKeys = {
  all: ['tech-trade'] as const,
  lists: () => [...techTradeKeys.all, 'list'] as const,
  list: (params: TechTradeListParams = {}) =>
    [...techTradeKeys.lists(), params] as const,
  details: () => [...techTradeKeys.all, 'detail'] as const,
  detail: (id: number) => [...techTradeKeys.details(), id] as const,
  lookups: () => [...techTradeKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...techTradeKeys.lookups(), { activeOnly }] as const,
} as const;
