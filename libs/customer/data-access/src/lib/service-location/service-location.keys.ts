import type { ServiceLocationListParams } from '@cms/customer-contract';

export const serviceLocationKeys = {
  all: ['service-location'] as const,
  lists: () => [...serviceLocationKeys.all, 'list'] as const,
  list: (customerId: number, params: ServiceLocationListParams = {}) =>
    [...serviceLocationKeys.lists(), customerId, params] as const,
  details: () => [...serviceLocationKeys.all, 'detail'] as const,
  detail: (customerId: number, locationId: number) =>
    [...serviceLocationKeys.details(), customerId, locationId] as const,
};
