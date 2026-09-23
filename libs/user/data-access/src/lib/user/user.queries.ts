import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  userDetailResponseSchema,
  userListResponseSchema,
  type UserDetailDto,
  type UserListParams,
  type UserListResult,
} from '@cms/user-contract';
import { toPagedResult } from '../util';
import { userDetailEndpoint, userListEndpoint } from './user.endpoints';
import { userKeys } from './user.keys';

export const loadUsers = async (
  params: UserListParams,
  { signal }: QueryRequestContext,
): Promise<UserListResult> => {
  const body = await customFetch<unknown>(userListEndpoint(params), {
    signal,
  });
  const data = userListResponseSchema.parse(body).data;
  return {
    ...toPagedResult(data),
    summary: data.summary ?? null,
  };
};

export const loadUser = async (
  id: string,
  { signal }: QueryRequestContext,
): Promise<UserDetailDto> => {
  const body = await customFetch<unknown>(userDetailEndpoint(id), {
    signal,
  });
  return userDetailResponseSchema.parse(body).data;
};

export const userListQueryOptions = (params: UserListParams = {}) =>
  queryOptions({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => loadUsers(params, { signal }),
    meta: { feature: 'user', operation: 'list' },
  });

export const userDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => loadUser(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'user', operation: 'detail' },
  });
