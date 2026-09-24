import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  businessTypeDetailResponseSchema,
  businessTypeListResponseSchema,
  businessTypeLookupResponseSchema,
  type BusinessTypeDetailDto,
  type BusinessTypeListParams,
  type BusinessTypeLookupDto,
  type BusinessTypeSummaryDto,
  type PagedResult,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  businessTypeDetailEndpoint,
  businessTypeListEndpoint,
  businessTypeLookupEndpoint,
} from './business-type.endpoints';
import { businessTypeKeys } from './business-type.keys';

export const loadBusinessTypes = async (
  params: BusinessTypeListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<BusinessTypeSummaryDto>> => {
  const body = await customFetch<unknown>(businessTypeListEndpoint(params), {
    signal,
  });
  return toPagedResult(businessTypeListResponseSchema.parse(body).data);
};

export const loadBusinessType = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<BusinessTypeDetailDto> => {
  const body = await customFetch<unknown>(businessTypeDetailEndpoint(id), {
    signal,
  });
  return businessTypeDetailResponseSchema.parse(body).data;
};

export const loadBusinessTypeLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly BusinessTypeLookupDto[]> => {
  const body = await customFetch<unknown>(
    businessTypeLookupEndpoint(activeOnly),
    { signal },
  );
  return businessTypeLookupResponseSchema.parse(body).data;
};

export const businessTypeListQueryOptions = (
  params: BusinessTypeListParams = {},
) =>
  queryOptions({
    queryKey: businessTypeKeys.list(params),
    queryFn: ({ signal }) => loadBusinessTypes(params, { signal }),
    meta: { feature: 'business-type', operation: 'list' },
  });

export const businessTypeDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: businessTypeKeys.detail(id),
    queryFn: ({ signal }) => loadBusinessType(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'business-type', operation: 'detail' },
  });

export const businessTypeLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: businessTypeKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadBusinessTypeLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'business-type', operation: 'lookup' },
  });
