import type { RoleListParams } from '@cms/user-contract';
import { toSearchParams } from '../util';

export const roleCollectionEndpoint = '/role';

export function roleListEndpoint(params: RoleListParams = {}): string {
  return `${roleCollectionEndpoint}${toSearchParams(params)}`;
}

export function roleDetailEndpoint(id: number): string {
  return `${roleCollectionEndpoint}/${id}`;
}

export function roleLookupEndpoint(activeOnly = true): string {
  return `${roleCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}

export function roleCloneEndpoint(id: number): string {
  return `${roleCollectionEndpoint}/${id}/clone`;
}
