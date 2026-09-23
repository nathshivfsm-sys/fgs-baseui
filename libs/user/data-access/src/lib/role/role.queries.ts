import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  roleDetailResponseSchema,
  roleListResponseSchema,
  roleLookupResponseSchema,
  type PagedResult,
  type RoleDetailDto,
  type RoleListParams,
  type RoleLookupDto,
  type RoleSummaryDto,
} from '@cms/user-contract';
import { toPagedResult } from '../util';
import {
  roleDetailEndpoint,
  roleListEndpoint,
  roleLookupEndpoint,
} from './role.endpoints';
import { roleKeys } from './role.keys';

export const loadRoles = async (
  params: RoleListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<RoleSummaryDto>> => {
  const body = await customFetch<unknown>(roleListEndpoint(params), {
    signal,
  });
  return toPagedResult(roleListResponseSchema.parse(body).data);
};

export const loadRole = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<RoleDetailDto> => {
  const body = await customFetch<unknown>(roleDetailEndpoint(id), {
    signal,
  });
  return roleDetailResponseSchema.parse(body).data;
};

export const loadRoleLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly RoleLookupDto[]> => {
  const body = await customFetch<unknown>(roleLookupEndpoint(activeOnly), {
    signal,
  });
  return roleLookupResponseSchema.parse(body).data;
};

export const roleListQueryOptions = (params: RoleListParams = {}) =>
  queryOptions({
    queryKey: roleKeys.list(params),
    queryFn: ({ signal }) => loadRoles(params, { signal }),
    meta: { feature: 'role', operation: 'list' },
  });

export const roleDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: roleKeys.detail(id),
    queryFn: ({ signal }) => loadRole(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'role', operation: 'detail' },
  });

export const roleLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: roleKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadRoleLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'role', operation: 'lookup' },
  });
