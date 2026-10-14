import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  rolePermissionDetailResponseSchema,
  rolePermissionListResponseSchema,
  type RolePermissionCreateDto,
  type RolePermissionDetailDto,
  type RolePermissionPatchDto,
  type RolePermissionSyncDto,
  type RolePermissionUpdateDto,
} from '@cms/user-contract';
import {
  rolePermissionCollectionEndpoint,
  rolePermissionItemEndpoint,
} from './role-permission.endpoints';
import { rolePermissionKeys } from './role-permission.keys';

async function parseRolePermissionDetail(
  body: unknown,
): Promise<RolePermissionDetailDto> {
  return rolePermissionDetailResponseSchema.parse(body).data;
}

export const createRolePermission = async (
  body: RolePermissionCreateDto,
  context?: QueryRequestContext,
): Promise<RolePermissionDetailDto> => {
  const response = await customFetch<unknown>(
    rolePermissionCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseRolePermissionDetail(response);
};

export const syncRolePermissions = async (
  body: RolePermissionSyncDto,
  context?: QueryRequestContext,
): Promise<RolePermissionDetailDto[]> => {
  const response = await customFetch<unknown>(
    rolePermissionCollectionEndpoint,
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return rolePermissionListResponseSchema.parse(response).data ?? [];
};

export const updateRolePermission = async (
  id: number,
  body: RolePermissionUpdateDto,
  context?: QueryRequestContext,
): Promise<RolePermissionDetailDto> => {
  const response = await customFetch<unknown>(rolePermissionItemEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseRolePermissionDetail(response);
};

export const patchRolePermission = async (
  id: number,
  body: RolePermissionPatchDto,
  context?: QueryRequestContext,
): Promise<RolePermissionDetailDto> => {
  const response = await customFetch<unknown>(rolePermissionItemEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseRolePermissionDetail(response);
};

function invalidateRolePermissions(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: rolePermissionKeys.all });
}

export const createRolePermissionMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: RolePermissionCreateDto) => createRolePermission(body),
    meta: { feature: 'role-permission', operation: 'create' },
    onSuccess: () => invalidateRolePermissions(queryClient),
  });

export const syncRolePermissionsMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: RolePermissionSyncDto) => syncRolePermissions(body),
    meta: { feature: 'role-permission', operation: 'sync' },
    onSuccess: () => invalidateRolePermissions(queryClient),
  });

export const updateRolePermissionMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: RolePermissionUpdateDto }) =>
      updateRolePermission(id, body),
    meta: { feature: 'role-permission', operation: 'update' },
    onSuccess: () => invalidateRolePermissions(queryClient),
  });

export const patchRolePermissionMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: RolePermissionPatchDto }) =>
      patchRolePermission(id, body),
    meta: { feature: 'role-permission', operation: 'patch' },
    onSuccess: () => invalidateRolePermissions(queryClient),
  });
