import type {
  PaymentMethodListParams,
  PaymentMethodLookupParams,
} from '@cms/settings-contract';

export const paymentMethodKeys = {
  all: ['payment-method'] as const,
  lists: () => [...paymentMethodKeys.all, 'list'] as const,
  list: (params: PaymentMethodListParams = {}) =>
    [...paymentMethodKeys.lists(), params] as const,
  details: () => [...paymentMethodKeys.all, 'detail'] as const,
  detail: (id: number) => [...paymentMethodKeys.details(), id] as const,
  lookups: () => [...paymentMethodKeys.all, 'lookup'] as const,
  lookup: (params: PaymentMethodLookupParams = {}) =>
    [...paymentMethodKeys.lookups(), params] as const,
} as const;
