import type { PermissionListParams } from '@cms/user-contract';
import { toSearchParams } from '../util';

export const permissionCollectionEndpoint = '/permission';

export function permissionListEndpoint(
  params: PermissionListParams = {},
): string {
  return `${permissionCollectionEndpoint}${toSearchParams(params)}`;
}

export function permissionDetailEndpoint(id: number): string {
  return `${permissionCollectionEndpoint}/${id}`;
}

export function permissionLookupEndpoint(activeOnly = true): string {
  return `${permissionCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
