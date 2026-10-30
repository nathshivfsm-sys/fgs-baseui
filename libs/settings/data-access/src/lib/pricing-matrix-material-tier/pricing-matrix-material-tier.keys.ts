import type {
  PricingMatrixMaterialTierListParams,
  PricingMatrixMaterialTierLookupParams,
} from '@cms/settings-contract';

export const pricingMatrixMaterialTierKeys = {
  all: ['pricing-matrix-material-tier'] as const,
  lists: () => [...pricingMatrixMaterialTierKeys.all, 'list'] as const,
  list: (params: PricingMatrixMaterialTierListParams = {}) =>
    [...pricingMatrixMaterialTierKeys.lists(), params] as const,
  details: () => [...pricingMatrixMaterialTierKeys.all, 'detail'] as const,
  detail: (id: number) =>
    [...pricingMatrixMaterialTierKeys.details(), id] as const,
  lookups: () => [...pricingMatrixMaterialTierKeys.all, 'lookup'] as const,
  lookup: (params: PricingMatrixMaterialTierLookupParams = {}) =>
    [...pricingMatrixMaterialTierKeys.lookups(), params] as const,
} as const;
