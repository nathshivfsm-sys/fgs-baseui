import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  subcategoryDetailResponseSchema,
  subcategoryListResponseSchema,
  subcategoryLookupResponseSchema,
  type PagedResult,
  type SubcategoryDetailDto,
  type SubcategoryListParams,
  type SubcategoryLookupDto,
  type SubcategorySummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  subcategoryDetailEndpoint,
  subcategoryListEndpoint,
  subcategoryLookupEndpoint,
} from './subcategory.endpoints';
import { subcategoryKeys } from './subcategory.keys';

export const loadSubcategories = async (
  params: SubcategoryListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<SubcategorySummaryDto>> => {
  const body = await customFetch<unknown>(subcategoryListEndpoint(params), {
    signal,
  });
  return toPagedResult(subcategoryListResponseSchema.parse(body).data);
};

export const loadSubcategory = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<SubcategoryDetailDto> => {
  const body = await customFetch<unknown>(subcategoryDetailEndpoint(id), {
    signal,
  });
  return subcategoryDetailResponseSchema.parse(body).data;
};

export const loadSubcategoryLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly SubcategoryLookupDto[]> => {
  const body = await customFetch<unknown>(
    subcategoryLookupEndpoint(activeOnly),
    { signal },
  );
  return subcategoryLookupResponseSchema.parse(body).data;
};

export const subcategoryListQueryOptions = (
  params: SubcategoryListParams = {},
) =>
  queryOptions({
    queryKey: subcategoryKeys.list(params),
    queryFn: ({ signal }) => loadSubcategories(params, { signal }),
    meta: { feature: 'subcategory', operation: 'list' },
  });

export const subcategoryDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: subcategoryKeys.detail(id),
    queryFn: ({ signal }) => loadSubcategory(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'subcategory', operation: 'detail' },
  });

export const subcategoryLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: subcategoryKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadSubcategoryLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'subcategory', operation: 'lookup' },
  });
