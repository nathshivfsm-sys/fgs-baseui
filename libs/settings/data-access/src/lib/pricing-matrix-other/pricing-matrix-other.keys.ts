import type {
  PricingMatrixOtherListParams,
  PricingMatrixOtherLookupParams,
} from '@cms/settings-contract';

export const pricingMatrixOtherKeys = {
  all: ['pricing-matrix-other'] as const,
  lists: () => [...pricingMatrixOtherKeys.all, 'list'] as const,
  list: (params: PricingMatrixOtherListParams = {}) =>
    [...pricingMatrixOtherKeys.lists(), params] as const,
  details: () => [...pricingMatrixOtherKeys.all, 'detail'] as const,
  detail: (id: number) => [...pricingMatrixOtherKeys.details(), id] as const,
  lookups: () => [...pricingMatrixOtherKeys.all, 'lookup'] as const,
  lookup: (params: PricingMatrixOtherLookupParams = {}) =>
    [...pricingMatrixOtherKeys.lookups(), params] as const,
} as const;
