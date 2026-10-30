import type {
  PricingMatrixLaborListParams,
  PricingMatrixLaborLookupParams,
} from '@cms/settings-contract';

export const pricingMatrixLaborKeys = {
  all: ['pricing-matrix-labor'] as const,
  lists: () => [...pricingMatrixLaborKeys.all, 'list'] as const,
  list: (params: PricingMatrixLaborListParams = {}) =>
    [...pricingMatrixLaborKeys.lists(), params] as const,
  details: () => [...pricingMatrixLaborKeys.all, 'detail'] as const,
  detail: (id: number) => [...pricingMatrixLaborKeys.details(), id] as const,
  lookups: () => [...pricingMatrixLaborKeys.all, 'lookup'] as const,
  lookup: (params: PricingMatrixLaborLookupParams = {}) =>
    [...pricingMatrixLaborKeys.lookups(), params] as const,
} as const;
