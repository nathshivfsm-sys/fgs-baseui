import type {
  BillingCategoryListParams,
  BillingCategoryLookupParams,
} from '@cms/settings-contract';

export const billingCategoryKeys = {
  all: ['billing-category'] as const,
  lists: () => [...billingCategoryKeys.all, 'list'] as const,
  list: (params: BillingCategoryListParams = {}) =>
    [...billingCategoryKeys.lists(), params] as const,
  details: () => [...billingCategoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...billingCategoryKeys.details(), id] as const,
  lookups: () => [...billingCategoryKeys.all, 'lookup'] as const,
  lookup: (params: BillingCategoryLookupParams = {}) =>
    [...billingCategoryKeys.lookups(), params] as const,
} as const;
