import type { UserRoleLookupParams } from '@cms/user-contract';
import { toSearchParams } from '../util';

export const userRoleCollectionEndpoint = '/userrole';

export function userRoleByUserEndpoint(userId: string): string {
  return `${userRoleCollectionEndpoint}/${userId}`;
}

export function userRoleItemEndpoint(id: number): string {
  return `${userRoleCollectionEndpoint}/item/${id}`;
}

export function userRoleLookupEndpoint(params: UserRoleLookupParams = {}): string {
  return `${userRoleCollectionEndpoint}/lookup${toSearchParams(params)}`;
}
