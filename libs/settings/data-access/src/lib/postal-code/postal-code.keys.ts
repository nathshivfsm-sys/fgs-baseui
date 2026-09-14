import type { PostalCodeListParams } from '@cms/settings-contract';

export const postalCodeKeys = {
  all: ['postalcode'] as const,
  lists: () => [...postalCodeKeys.all, 'list'] as const,
  list: (params: PostalCodeListParams = {}) =>
    [...postalCodeKeys.lists(), params] as const,
  details: () => [...postalCodeKeys.all, 'detail'] as const,
  detail: (id: number) => [...postalCodeKeys.details(), id] as const,
  lookups: () => [...postalCodeKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...postalCodeKeys.lookups(), { activeOnly }] as const,
} as const;
