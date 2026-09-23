import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  userCreateResponseSchema,
  userDetailResponseSchema,
  type UserDetailDto,
  type UserInviteDto,
  type UserPatchDto,
  type UserUpdateDto,
} from '@cms/user-contract';
import {
  userCollectionEndpoint,
  userDetailEndpoint,
  userResendInviteEndpoint,
} from './user.endpoints';
import { userKeys } from './user.keys';

async function parseUserDetail(body: unknown): Promise<UserDetailDto> {
  return userDetailResponseSchema.parse(body).data;
}

export const createUsers = async (
  body: UserInviteDto[],
  context?: QueryRequestContext,
): Promise<UserDetailDto[]> => {
  const response = await customFetch<unknown>(userCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return userCreateResponseSchema.parse(response).data ?? [];
};

export const updateUser = async (
  id: string,
  body: UserUpdateDto,
  context?: QueryRequestContext,
): Promise<UserDetailDto> => {
  const response = await customFetch<unknown>(userDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseUserDetail(response);
};

export const patchUser = async (
  id: string,
  body: UserPatchDto,
  context?: QueryRequestContext,
): Promise<UserDetailDto> => {
  const response = await customFetch<unknown>(userDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseUserDetail(response);
};

export const resendUserInvite = async (
  id: string,
  context?: QueryRequestContext,
): Promise<UserDetailDto> => {
  const response = await customFetch<unknown>(userResendInviteEndpoint(id), {
    method: 'POST',
    signal: context?.signal,
  });
  return parseUserDetail(response);
};

function invalidateUsers(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: userKeys.all });
}

export const createUsersMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: UserInviteDto[]) => createUsers(body),
    meta: { feature: 'user', operation: 'create' },
    onSuccess: () => invalidateUsers(queryClient),
  });

export const updateUserMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: string; body: UserUpdateDto }) =>
      updateUser(id, body),
    meta: { feature: 'user', operation: 'update' },
    onSuccess: () => invalidateUsers(queryClient),
  });

export const patchUserMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: string; body: UserPatchDto }) =>
      patchUser(id, body),
    meta: { feature: 'user', operation: 'patch' },
    onSuccess: () => invalidateUsers(queryClient),
  });

export const resendUserInviteMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (id: string) => resendUserInvite(id),
    meta: { feature: 'user', operation: 'resend-invite' },
    onSuccess: () => invalidateUsers(queryClient),
  });
