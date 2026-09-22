import type { RoleListParams } from '@cms/user-contract';

export const roleKeys = {
  all: ['role'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params: RoleListParams = {}) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: number) => [...roleKeys.details(), id] as const,
  lookups: () => [...roleKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...roleKeys.lookups(), { activeOnly }] as const,
} as const;
