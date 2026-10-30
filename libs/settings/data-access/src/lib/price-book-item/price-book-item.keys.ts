import type {
  PriceBookItemListParams,
  PriceBookItemLookupParams,
} from '@cms/settings-contract';

export const priceBookItemKeys = {
  all: ['price-book-item'] as const,
  lists: () => [...priceBookItemKeys.all, 'list'] as const,
  list: (params: PriceBookItemListParams = {}) =>
    [...priceBookItemKeys.lists(), params] as const,
  details: () => [...priceBookItemKeys.all, 'detail'] as const,
  detail: (id: number) => [...priceBookItemKeys.details(), id] as const,
  lookups: () => [...priceBookItemKeys.all, 'lookup'] as const,
  lookup: (params: PriceBookItemLookupParams = {}) =>
    [...priceBookItemKeys.lookups(), params] as const,
} as const;
