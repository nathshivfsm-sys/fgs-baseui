import type { TaxAuthorityListParams } from '@cms/settings-contract';

export const taxAuthorityKeys = {
  all: ['tax-authority'] as const,
  lists: () => [...taxAuthorityKeys.all, 'list'] as const,
  list: (params: TaxAuthorityListParams = {}) =>
    [...taxAuthorityKeys.lists(), params] as const,
  details: () => [...taxAuthorityKeys.all, 'detail'] as const,
  detail: (id: number) => [...taxAuthorityKeys.details(), id] as const,
  lookups: () => [...taxAuthorityKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...taxAuthorityKeys.lookups(), { activeOnly }] as const,
} as const;
