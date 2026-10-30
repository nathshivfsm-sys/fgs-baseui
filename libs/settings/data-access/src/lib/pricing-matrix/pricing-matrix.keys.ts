import type { PricingMatrixListParams } from '@cms/settings-contract';

export const pricingMatrixKeys = {
  all: ['pricing-matrix'] as const,
  lists: () => [...pricingMatrixKeys.all, 'list'] as const,
  list: (params: PricingMatrixListParams = {}) =>
    [...pricingMatrixKeys.lists(), params] as const,
  details: () => [...pricingMatrixKeys.all, 'detail'] as const,
  detail: (id: number) => [...pricingMatrixKeys.details(), id] as const,
  lookups: () => [...pricingMatrixKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...pricingMatrixKeys.lookups(), { activeOnly }] as const,
} as const;
