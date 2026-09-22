import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  roleDetailResponseSchema,
  type RoleCloneDto,
  type RoleCreateDto,
  type RoleDetailDto,
  type RolePatchDto,
  type RoleUpdateDto,
} from '@cms/user-contract';
import {
  roleCloneEndpoint,
  roleCollectionEndpoint,
  roleDetailEndpoint,
} from './role.endpoints';
import { roleKeys } from './role.keys';

async function parseRoleDetail(body: unknown): Promise<RoleDetailDto> {
  return roleDetailResponseSchema.parse(body).data;
}

export const createRole = async (
  body: RoleCreateDto,
  context?: QueryRequestContext,
): Promise<RoleDetailDto> => {
  const response = await customFetch<unknown>(roleCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseRoleDetail(response);
};

export const updateRole = async (
  id: number,
  body: RoleUpdateDto,
  context?: QueryRequestContext,
): Promise<RoleDetailDto> => {
  const response = await customFetch<unknown>(roleDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseRoleDetail(response);
};

export const patchRole = async (
  id: number,
  body: RolePatchDto,
  context?: QueryRequestContext,
): Promise<RoleDetailDto> => {
  const response = await customFetch<unknown>(roleDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseRoleDetail(response);
};

export const cloneRole = async (
  id: number,
  body: RoleCloneDto,
  context?: QueryRequestContext,
): Promise<RoleDetailDto> => {
  const response = await customFetch<unknown>(roleCloneEndpoint(id), {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseRoleDetail(response);
};

function invalidateRoles(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: roleKeys.all });
}

export const createRoleMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: RoleCreateDto) => createRole(body),
    meta: { feature: 'role', operation: 'create' },
    onSuccess: () => invalidateRoles(queryClient),
  });

export const updateRoleMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: RoleUpdateDto }) =>
      updateRole(id, body),
    meta: { feature: 'role', operation: 'update' },
    onSuccess: () => invalidateRoles(queryClient),
  });

export const patchRoleMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: RolePatchDto }) =>
      patchRole(id, body),
    meta: { feature: 'role', operation: 'patch' },
    onSuccess: () => invalidateRoles(queryClient),
  });

export const cloneRoleMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: RoleCloneDto }) =>
      cloneRole(id, body),
    meta: { feature: 'role', operation: 'clone' },
    onSuccess: () => invalidateRoles(queryClient),
  });
