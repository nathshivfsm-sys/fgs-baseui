import type { RolePermissionLookupParams } from '@cms/user-contract';
import { toSearchParams } from '../util';

export const rolePermissionCollectionEndpoint = '/rolepermission';

export function rolePermissionByRoleEndpoint(fgsRoleId: number): string {
  return `${rolePermissionCollectionEndpoint}/${fgsRoleId}`;
}

export function rolePermissionItemEndpoint(id: number): string {
  return `${rolePermissionCollectionEndpoint}/item/${id}`;
}

export function rolePermissionLookupEndpoint(
  params: RolePermissionLookupParams = {},
): string {
  return `${rolePermissionCollectionEndpoint}/lookup${toSearchParams(params)}`;
}
