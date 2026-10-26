import type { ServiceLocationListFilters } from '../types';

export type { ServiceLocationListFilters };

export const emptyServiceLocationListFilters =
  (): ServiceLocationListFilters => ({
    customerType: '',
  });

export const countServiceLocationListFilters = (
  filters: ServiceLocationListFilters,
): number => (filters.customerType ? 1 : 0);

export const toServiceLocationListQueryFilters = (
  filters: ServiceLocationListFilters,
) => ({
  customerType: filters.customerType || undefined,
});
