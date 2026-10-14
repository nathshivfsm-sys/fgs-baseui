import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  permissionDetailResponseSchema,
  type PermissionCreateDto,
  type PermissionDetailDto,
  type PermissionPatchDto,
  type PermissionUpdateDto,
} from '@cms/user-contract';
import {
  permissionCollectionEndpoint,
  permissionDetailEndpoint,
} from './permission.endpoints';
import { permissionKeys } from './permission.keys';

async function parsePermissionDetail(
  body: unknown,
): Promise<PermissionDetailDto> {
  return permissionDetailResponseSchema.parse(body).data;
}

export const createPermission = async (
  body: PermissionCreateDto,
  context?: QueryRequestContext,
): Promise<PermissionDetailDto> => {
  const response = await customFetch<unknown>(permissionCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePermissionDetail(response);
};

export const updatePermission = async (
  id: number,
  body: PermissionUpdateDto,
  context?: QueryRequestContext,
): Promise<PermissionDetailDto> => {
  const response = await customFetch<unknown>(permissionDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePermissionDetail(response);
};

export const patchPermission = async (
  id: number,
  body: PermissionPatchDto,
  context?: QueryRequestContext,
): Promise<PermissionDetailDto> => {
  const response = await customFetch<unknown>(permissionDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePermissionDetail(response);
};

function invalidatePermissions(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: permissionKeys.all });
}

export const createPermissionMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: PermissionCreateDto) => createPermission(body),
    meta: { feature: 'permission', operation: 'create' },
    onSuccess: () => invalidatePermissions(queryClient),
  });

export const updatePermissionMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PermissionUpdateDto }) =>
      updatePermission(id, body),
    meta: { feature: 'permission', operation: 'update' },
    onSuccess: () => invalidatePermissions(queryClient),
  });

export const patchPermissionMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PermissionPatchDto }) =>
      patchPermission(id, body),
    meta: { feature: 'permission', operation: 'patch' },
    onSuccess: () => invalidatePermissions(queryClient),
  });
