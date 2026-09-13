import type { NonWorkingDateListParams } from '@cms/settings-contract';

export const nonWorkingDateKeys = {
  all: ['non-working-date'] as const,
  lists: () => [...nonWorkingDateKeys.all, 'list'] as const,
  list: (params: NonWorkingDateListParams = {}) =>
    [...nonWorkingDateKeys.lists(), params] as const,
  details: () => [...nonWorkingDateKeys.all, 'detail'] as const,
  detail: (id: number) => [...nonWorkingDateKeys.details(), id] as const,
  lookups: () => [...nonWorkingDateKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...nonWorkingDateKeys.lookups(), { activeOnly }] as const,
} as const;
