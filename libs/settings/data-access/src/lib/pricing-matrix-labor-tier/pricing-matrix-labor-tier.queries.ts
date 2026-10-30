import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixLaborTierDetailResponseSchema,
  pricingMatrixLaborTierListResponseSchema,
  pricingMatrixLaborTierLookupResponseSchema,
  type PagedResult,
  type PricingMatrixLaborTierDetailDto,
  type PricingMatrixLaborTierListParams,
  type PricingMatrixLaborTierLookupDto,
  type PricingMatrixLaborTierLookupParams,
  type PricingMatrixLaborTierSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  pricingMatrixLaborTierDetailEndpoint,
  pricingMatrixLaborTierListEndpoint,
  pricingMatrixLaborTierLookupEndpoint,
} from './pricing-matrix-labor-tier.endpoints';
import { pricingMatrixLaborTierKeys } from './pricing-matrix-labor-tier.keys';

export const loadPricingMatrixLaborTiers = async (
  params: PricingMatrixLaborTierListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PricingMatrixLaborTierSummaryDto>> => {
  const body = await customFetch<unknown>(
    pricingMatrixLaborTierListEndpoint(params),
    { signal },
  );
  return toPagedResult(
    pricingMatrixLaborTierListResponseSchema.parse(body).data,
  );
};

export const loadPricingMatrixLaborTier = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PricingMatrixLaborTierDetailDto> => {
  const body = await customFetch<unknown>(
    pricingMatrixLaborTierDetailEndpoint(id),
    { signal },
  );
  return pricingMatrixLaborTierDetailResponseSchema.parse(body).data;
};

export const loadPricingMatrixLaborTierLookup = async (
  params: PricingMatrixLaborTierLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly PricingMatrixLaborTierLookupDto[]> => {
  const body = await customFetch<unknown>(
    pricingMatrixLaborTierLookupEndpoint(params),
    { signal },
  );
  return pricingMatrixLaborTierLookupResponseSchema.parse(body).data;
};

export const pricingMatrixLaborTierListQueryOptions = (
  params: PricingMatrixLaborTierListParams = {},
) =>
  queryOptions({
    queryKey: pricingMatrixLaborTierKeys.list(params),
    queryFn: ({ signal }) => loadPricingMatrixLaborTiers(params, { signal }),
    meta: { feature: 'pricing-matrix-labor-tier', operation: 'list' },
  });

export const pricingMatrixLaborTierDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: pricingMatrixLaborTierKeys.detail(id),
    queryFn: ({ signal }) => loadPricingMatrixLaborTier(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix-labor-tier', operation: 'detail' },
  });

export const pricingMatrixLaborTierLookupQueryOptions = (
  params: PricingMatrixLaborTierLookupParams = {},
) => {
  const resolved: PricingMatrixLaborTierLookupParams = {
    activeOnly: params.activeOnly ?? true,
    pricingMatrixLaborId: params.pricingMatrixLaborId,
  };
  return queryOptions({
    queryKey: pricingMatrixLaborTierKeys.lookup(resolved),
    queryFn: ({ signal }) =>
      loadPricingMatrixLaborTierLookup(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix-labor-tier', operation: 'lookup' },
  });
};
