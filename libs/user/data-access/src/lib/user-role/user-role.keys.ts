import type { UserRoleLookupParams } from '@cms/user-contract';

export const userRoleKeys = {
  all: ['user-role'] as const,
  byUser: (userId: string) => [...userRoleKeys.all, 'by-user', userId] as const,
  items: () => [...userRoleKeys.all, 'item'] as const,
  item: (id: number) => [...userRoleKeys.items(), id] as const,
  lookups: () => [...userRoleKeys.all, 'lookup'] as const,
  lookup: (params: UserRoleLookupParams = {}) =>
    [...userRoleKeys.lookups(), params] as const,
} as const;
