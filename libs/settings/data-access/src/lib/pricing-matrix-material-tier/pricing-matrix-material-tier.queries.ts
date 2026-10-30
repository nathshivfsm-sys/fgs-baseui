import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixMaterialTierDetailResponseSchema,
  pricingMatrixMaterialTierListResponseSchema,
  pricingMatrixMaterialTierLookupResponseSchema,
  type PagedResult,
  type PricingMatrixMaterialTierDetailDto,
  type PricingMatrixMaterialTierListParams,
  type PricingMatrixMaterialTierLookupDto,
  type PricingMatrixMaterialTierLookupParams,
  type PricingMatrixMaterialTierSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  pricingMatrixMaterialTierDetailEndpoint,
  pricingMatrixMaterialTierListEndpoint,
  pricingMatrixMaterialTierLookupEndpoint,
} from './pricing-matrix-material-tier.endpoints';
import { pricingMatrixMaterialTierKeys } from './pricing-matrix-material-tier.keys';

export const loadPricingMatrixMaterialTiers = async (
  params: PricingMatrixMaterialTierListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PricingMatrixMaterialTierSummaryDto>> => {
  const body = await customFetch<unknown>(
    pricingMatrixMaterialTierListEndpoint(params),
    { signal },
  );
  return toPagedResult(
    pricingMatrixMaterialTierListResponseSchema.parse(body).data,
  );
};

export const loadPricingMatrixMaterialTier = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PricingMatrixMaterialTierDetailDto> => {
  const body = await customFetch<unknown>(
    pricingMatrixMaterialTierDetailEndpoint(id),
    { signal },
  );
  return pricingMatrixMaterialTierDetailResponseSchema.parse(body).data;
};

export const loadPricingMatrixMaterialTierLookup = async (
  params: PricingMatrixMaterialTierLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly PricingMatrixMaterialTierLookupDto[]> => {
  const body = await customFetch<unknown>(
    pricingMatrixMaterialTierLookupEndpoint(params),
    { signal },
  );
  return pricingMatrixMaterialTierLookupResponseSchema.parse(body).data;
};

export const pricingMatrixMaterialTierListQueryOptions = (
  params: PricingMatrixMaterialTierListParams = {},
) =>
  queryOptions({
    queryKey: pricingMatrixMaterialTierKeys.list(params),
    queryFn: ({ signal }) => loadPricingMatrixMaterialTiers(params, { signal }),
    meta: { feature: 'pricing-matrix-material-tier', operation: 'list' },
  });

export const pricingMatrixMaterialTierDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: pricingMatrixMaterialTierKeys.detail(id),
    queryFn: ({ signal }) => loadPricingMatrixMaterialTier(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix-material-tier', operation: 'detail' },
  });

export const pricingMatrixMaterialTierLookupQueryOptions = (
  params: PricingMatrixMaterialTierLookupParams = {},
) => {
  const resolved: PricingMatrixMaterialTierLookupParams = {
    activeOnly: params.activeOnly ?? true,
    pricingMatrixId: params.pricingMatrixId,
  };
  return queryOptions({
    queryKey: pricingMatrixMaterialTierKeys.lookup(resolved),
    queryFn: ({ signal }) =>
      loadPricingMatrixMaterialTierLookup(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix-material-tier', operation: 'lookup' },
  });
};
