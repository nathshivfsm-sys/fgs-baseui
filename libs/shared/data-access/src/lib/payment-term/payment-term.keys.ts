import type { PaymentTermListParams } from '@cms/shared-contract';

export const paymentTermKeys = {
  all: ['payment-term'] as const,
  lists: () => [...paymentTermKeys.all, 'list'] as const,
  list: (params: PaymentTermListParams = {}) =>
    [...paymentTermKeys.lists(), params] as const,
  details: () => [...paymentTermKeys.all, 'detail'] as const,
  detail: (id: number) => [...paymentTermKeys.details(), id] as const,
  lookups: () => [...paymentTermKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...paymentTermKeys.lookups(), { activeOnly }] as const,
} as const;
