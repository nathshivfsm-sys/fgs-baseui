import type { RolePermissionLookupParams } from '@cms/user-contract';

export const rolePermissionKeys = {
  all: ['role-permission'] as const,
  byRole: (fgsRoleId: number) =>
    [...rolePermissionKeys.all, 'by-role', fgsRoleId] as const,
  items: () => [...rolePermissionKeys.all, 'item'] as const,
  item: (id: number) => [...rolePermissionKeys.items(), id] as const,
  lookups: () => [...rolePermissionKeys.all, 'lookup'] as const,
  lookup: (params: RolePermissionLookupParams = {}) =>
    [...rolePermissionKeys.lookups(), params] as const,
} as const;
