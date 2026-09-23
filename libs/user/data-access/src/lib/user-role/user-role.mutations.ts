import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  userRoleDetailResponseSchema,
  userRoleListResponseSchema,
  type UserRoleCreateDto,
  type UserRoleDetailDto,
  type UserRolePatchDto,
  type UserRoleSyncDto,
  type UserRoleUpdateDto,
} from '@cms/user-contract';
import {
  userRoleCollectionEndpoint,
  userRoleItemEndpoint,
} from './user-role.endpoints';
import { userRoleKeys } from './user-role.keys';

async function parseUserRoleDetail(body: unknown): Promise<UserRoleDetailDto> {
  return userRoleDetailResponseSchema.parse(body).data;
}

export const createUserRole = async (
  body: UserRoleCreateDto,
  context?: QueryRequestContext,
): Promise<UserRoleDetailDto> => {
  const response = await customFetch<unknown>(userRoleCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseUserRoleDetail(response);
};

export const syncUserRoles = async (
  body: UserRoleSyncDto,
  context?: QueryRequestContext,
): Promise<UserRoleDetailDto[]> => {
  const response = await customFetch<unknown>(userRoleCollectionEndpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return userRoleListResponseSchema.parse(response).data ?? [];
};

export const updateUserRole = async (
  id: number,
  body: UserRoleUpdateDto,
  context?: QueryRequestContext,
): Promise<UserRoleDetailDto> => {
  const response = await customFetch<unknown>(userRoleItemEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseUserRoleDetail(response);
};

export const patchUserRole = async (
  id: number,
  body: UserRolePatchDto,
  context?: QueryRequestContext,
): Promise<UserRoleDetailDto> => {
  const response = await customFetch<unknown>(userRoleItemEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseUserRoleDetail(response);
};

function invalidateUserRoles(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: userRoleKeys.all });
}

export const createUserRoleMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: UserRoleCreateDto) => createUserRole(body),
    meta: { feature: 'user-role', operation: 'create' },
    onSuccess: () => invalidateUserRoles(queryClient),
  });

export const syncUserRolesMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: UserRoleSyncDto) => syncUserRoles(body),
    meta: { feature: 'user-role', operation: 'sync' },
    onSuccess: () => invalidateUserRoles(queryClient),
  });

export const updateUserRoleMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: UserRoleUpdateDto }) =>
      updateUserRole(id, body),
    meta: { feature: 'user-role', operation: 'update' },
    onSuccess: () => invalidateUserRoles(queryClient),
  });

export const patchUserRoleMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: UserRolePatchDto }) =>
      patchUserRole(id, body),
    meta: { feature: 'user-role', operation: 'patch' },
    onSuccess: () => invalidateUserRoles(queryClient),
  });
