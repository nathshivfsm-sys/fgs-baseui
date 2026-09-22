import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  userRoleDetailResponseSchema,
  userRoleListResponseSchema,
  userRoleLookupResponseSchema,
  type UserRoleDetailDto,
  type UserRoleLookupDto,
  type UserRoleLookupParams,
} from '@cms/user-contract';
import {
  userRoleByUserEndpoint,
  userRoleItemEndpoint,
  userRoleLookupEndpoint,
} from './user-role.endpoints';
import { userRoleKeys } from './user-role.keys';

export const loadUserRolesByUser = async (
  userId: string,
  { signal }: QueryRequestContext,
): Promise<readonly UserRoleDetailDto[]> => {
  const body = await customFetch<unknown>(userRoleByUserEndpoint(userId), {
    signal,
  });
  return userRoleListResponseSchema.parse(body).data ?? [];
};

export const loadUserRole = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<UserRoleDetailDto> => {
  const body = await customFetch<unknown>(userRoleItemEndpoint(id), {
    signal,
  });
  return userRoleDetailResponseSchema.parse(body).data;
};

export const loadUserRoleLookup = async (
  params: UserRoleLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly UserRoleLookupDto[]> => {
  const body = await customFetch<unknown>(userRoleLookupEndpoint(params), {
    signal,
  });
  return userRoleLookupResponseSchema.parse(body).data ?? [];
};

export const userRolesByUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: userRoleKeys.byUser(userId),
    queryFn: ({ signal }) => loadUserRolesByUser(userId, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'user-role', operation: 'list-by-user' },
  });

export const userRoleDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: userRoleKeys.item(id),
    queryFn: ({ signal }) => loadUserRole(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'user-role', operation: 'detail' },
  });

export const userRoleLookupQueryOptions = (params: UserRoleLookupParams = {}) =>
  queryOptions({
    queryKey: userRoleKeys.lookup(params),
    queryFn: ({ signal }) => loadUserRoleLookup(params, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'user-role', operation: 'lookup' },
  });
