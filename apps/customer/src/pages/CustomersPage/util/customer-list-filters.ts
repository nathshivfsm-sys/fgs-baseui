import type { CustomerListParams } from '@cms/customer-contract';
import type { CustomerListFilters } from '../types';

export const emptyCustomerListFilters = (): CustomerListFilters => ({
  isPreferred: '',
});

export const countCustomerListFilters = (filters: CustomerListFilters) =>
  filters.isPreferred === '' ? 0 : 1;

export const toCustomerListQueryFilters = (
  filters: CustomerListFilters,
): Pick<CustomerListParams, 'isPreferred'> => ({
  isPreferred:
    filters.isPreferred === '' ? undefined : filters.isPreferred === 'true',
});
