import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  rolePermissionDetailResponseSchema,
  rolePermissionListResponseSchema,
  rolePermissionLookupResponseSchema,
  type RolePermissionDetailDto,
  type RolePermissionLookupDto,
  type RolePermissionLookupParams,
} from '@cms/user-contract';
import {
  rolePermissionByRoleEndpoint,
  rolePermissionItemEndpoint,
  rolePermissionLookupEndpoint,
} from './role-permission.endpoints';
import { rolePermissionKeys } from './role-permission.keys';

export const loadRolePermissionsByRole = async (
  fgsRoleId: number,
  { signal }: QueryRequestContext,
): Promise<readonly RolePermissionDetailDto[]> => {
  const body = await customFetch<unknown>(
    rolePermissionByRoleEndpoint(fgsRoleId),
    { signal },
  );
  return rolePermissionListResponseSchema.parse(body).data ?? [];
};

export const loadRolePermission = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<RolePermissionDetailDto> => {
  const body = await customFetch<unknown>(rolePermissionItemEndpoint(id), {
    signal,
  });
  return rolePermissionDetailResponseSchema.parse(body).data;
};

export const loadRolePermissionLookup = async (
  params: RolePermissionLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly RolePermissionLookupDto[]> => {
  const body = await customFetch<unknown>(
    rolePermissionLookupEndpoint(params),
    { signal },
  );
  return rolePermissionLookupResponseSchema.parse(body).data ?? [];
};

export const rolePermissionsByRoleQueryOptions = (fgsRoleId: number) =>
  queryOptions({
    queryKey: rolePermissionKeys.byRole(fgsRoleId),
    queryFn: ({ signal }) => loadRolePermissionsByRole(fgsRoleId, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'role-permission', operation: 'list-by-role' },
  });

export const rolePermissionDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: rolePermissionKeys.item(id),
    queryFn: ({ signal }) => loadRolePermission(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'role-permission', operation: 'detail' },
  });

export const rolePermissionLookupQueryOptions = (
  params: RolePermissionLookupParams = {},
) =>
  queryOptions({
    queryKey: rolePermissionKeys.lookup(params),
    queryFn: ({ signal }) => loadRolePermissionLookup(params, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'role-permission', operation: 'lookup' },
  });
