import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  permissionDetailResponseSchema,
  permissionListResponseSchema,
  permissionLookupResponseSchema,
  type PagedResult,
  type PermissionDetailDto,
  type PermissionListParams,
  type PermissionLookupDto,
  type PermissionSummaryDto,
} from '@cms/user-contract';
import { toPagedResult } from '../util';
import {
  permissionDetailEndpoint,
  permissionListEndpoint,
  permissionLookupEndpoint,
} from './permission.endpoints';
import { permissionKeys } from './permission.keys';

export const loadPermissions = async (
  params: PermissionListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PermissionSummaryDto>> => {
  const body = await customFetch<unknown>(permissionListEndpoint(params), {
    signal,
  });
  return toPagedResult(permissionListResponseSchema.parse(body).data);
};

export const loadPermission = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PermissionDetailDto> => {
  const body = await customFetch<unknown>(permissionDetailEndpoint(id), {
    signal,
  });
  return permissionDetailResponseSchema.parse(body).data;
};

export const loadPermissionLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly PermissionLookupDto[]> => {
  const body = await customFetch<unknown>(
    permissionLookupEndpoint(activeOnly),
    {
      signal,
    },
  );
  return permissionLookupResponseSchema.parse(body).data ?? [];
};

export const permissionListQueryOptions = (params: PermissionListParams = {}) =>
  queryOptions({
    queryKey: permissionKeys.list(params),
    queryFn: ({ signal }) => loadPermissions(params, { signal }),
    meta: { feature: 'permission', operation: 'list' },
  });

export const permissionDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: permissionKeys.detail(id),
    queryFn: ({ signal }) => loadPermission(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'permission', operation: 'detail' },
  });

export const permissionLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: permissionKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadPermissionLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'permission', operation: 'lookup' },
  });
