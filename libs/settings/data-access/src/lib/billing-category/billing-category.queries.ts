import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  billingCategoryDetailResponseSchema,
  billingCategoryListResponseSchema,
  billingCategoryLookupResponseSchema,
  type BillingCategoryDetailDto,
  type BillingCategoryListParams,
  type BillingCategoryLookupDto,
  type BillingCategoryLookupParams,
  type BillingCategorySummaryDto,
  type PagedResult,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  billingCategoryDetailEndpoint,
  billingCategoryListEndpoint,
  billingCategoryLookupEndpoint,
} from './billing-category.endpoints';
import { billingCategoryKeys } from './billing-category.keys';

export const loadBillingCategories = async (
  params: BillingCategoryListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<BillingCategorySummaryDto>> => {
  const body = await customFetch<unknown>(billingCategoryListEndpoint(params), {
    signal,
  });
  return toPagedResult(billingCategoryListResponseSchema.parse(body).data);
};

export const loadBillingCategory = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<BillingCategoryDetailDto> => {
  const body = await customFetch<unknown>(billingCategoryDetailEndpoint(id), {
    signal,
  });
  return billingCategoryDetailResponseSchema.parse(body).data;
};

export const loadBillingCategoryLookup = async (
  params: BillingCategoryLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly BillingCategoryLookupDto[]> => {
  const body = await customFetch<unknown>(
    billingCategoryLookupEndpoint(params),
    { signal },
  );
  return billingCategoryLookupResponseSchema.parse(body).data;
};

export const billingCategoryListQueryOptions = (
  params: BillingCategoryListParams = {},
) =>
  queryOptions({
    queryKey: billingCategoryKeys.list(params),
    queryFn: ({ signal }) => loadBillingCategories(params, { signal }),
    meta: { feature: 'billing-category', operation: 'list' },
  });

export const billingCategoryDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: billingCategoryKeys.detail(id),
    queryFn: ({ signal }) => loadBillingCategory(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'billing-category', operation: 'detail' },
  });

export const billingCategoryLookupQueryOptions = (
  params: BillingCategoryLookupParams = {},
) => {
  const resolved: BillingCategoryLookupParams = {
    activeOnly: params.activeOnly ?? true,
    showToFieldTech: params.showToFieldTech,
    allowToPick: params.allowToPick,
  };
  return queryOptions({
    queryKey: billingCategoryKeys.lookup(resolved),
    queryFn: ({ signal }) => loadBillingCategoryLookup(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'billing-category', operation: 'lookup' },
  });
};
