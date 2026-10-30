import type {
  PricingMatrixLaborTierListParams,
  PricingMatrixLaborTierLookupParams,
} from '@cms/settings-contract';

export const pricingMatrixLaborTierKeys = {
  all: ['pricing-matrix-labor-tier'] as const,
  lists: () => [...pricingMatrixLaborTierKeys.all, 'list'] as const,
  list: (params: PricingMatrixLaborTierListParams = {}) =>
    [...pricingMatrixLaborTierKeys.lists(), params] as const,
  details: () => [...pricingMatrixLaborTierKeys.all, 'detail'] as const,
  detail: (id: number) =>
    [...pricingMatrixLaborTierKeys.details(), id] as const,
  lookups: () => [...pricingMatrixLaborTierKeys.all, 'lookup'] as const,
  lookup: (params: PricingMatrixLaborTierLookupParams = {}) =>
    [...pricingMatrixLaborTierKeys.lookups(), params] as const,
} as const;
