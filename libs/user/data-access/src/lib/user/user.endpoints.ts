import type { UserListParams } from '@cms/user-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const userCollectionEndpoint = '/user';

export function userListEndpoint(params: UserListParams = {}): string {
  const { roleIds, ...rest } = params;
  const search = new URLSearchParams(
    toSearchParams(rest).replace(/^\?/, ''),
  );
  if (roleIds?.length) {
    for (const roleId of roleIds) {
      search.append('roleIds', String(roleId));
    }
  }
  const query = search.toString();
  return query ? `${userCollectionEndpoint}?${query}` : userCollectionEndpoint;
}

export function userDetailEndpoint(id: string): string {
  return `${userCollectionEndpoint}/${id}`;
}

export function userResendInviteEndpoint(id: string): string {
  return `${userCollectionEndpoint}/${id}/resendinvite`;
}
