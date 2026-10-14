import type { PermissionListParams } from '@cms/user-contract';

export const permissionKeys = {
  all: ['permission'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (params: PermissionListParams = {}) =>
    [...permissionKeys.lists(), params] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: number) => [...permissionKeys.details(), id] as const,
  lookups: () => [...permissionKeys.all, 'lookup'] as const,
  lookup: (activeOnly = true) =>
    [...permissionKeys.lookups(), activeOnly] as const,
} as const;
