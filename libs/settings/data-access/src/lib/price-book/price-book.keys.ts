import type { PriceBookListParams } from '@cms/settings-contract';

export const priceBookKeys = {
  all: ['price-book'] as const,
  lists: () => [...priceBookKeys.all, 'list'] as const,
  list: (params: PriceBookListParams = {}) =>
    [...priceBookKeys.lists(), params] as const,
  details: () => [...priceBookKeys.all, 'detail'] as const,
  detail: (id: number) => [...priceBookKeys.details(), id] as const,
  lookups: () => [...priceBookKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...priceBookKeys.lookups(), { activeOnly }] as const,
} as const;
