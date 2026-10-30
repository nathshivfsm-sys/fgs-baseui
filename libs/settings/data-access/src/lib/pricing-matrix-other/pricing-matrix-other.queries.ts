import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixOtherDetailResponseSchema,
  pricingMatrixOtherListResponseSchema,
  pricingMatrixOtherLookupResponseSchema,
  type PagedResult,
  type PricingMatrixOtherDetailDto,
  type PricingMatrixOtherListParams,
  type PricingMatrixOtherLookupDto,
  type PricingMatrixOtherLookupParams,
  type PricingMatrixOtherSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  pricingMatrixOtherDetailEndpoint,
  pricingMatrixOtherListEndpoint,
  pricingMatrixOtherLookupEndpoint,
} from './pricing-matrix-other.endpoints';
import { pricingMatrixOtherKeys } from './pricing-matrix-other.keys';

export const loadPricingMatrixOthers = async (
  params: PricingMatrixOtherListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PricingMatrixOtherSummaryDto>> => {
  const body = await customFetch<unknown>(
    pricingMatrixOtherListEndpoint(params),
    { signal },
  );
  return toPagedResult(pricingMatrixOtherListResponseSchema.parse(body).data);
};

export const loadPricingMatrixOther = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PricingMatrixOtherDetailDto> => {
  const body = await customFetch<unknown>(
    pricingMatrixOtherDetailEndpoint(id),
    {
      signal,
    },
  );
  return pricingMatrixOtherDetailResponseSchema.parse(body).data;
};

export const loadPricingMatrixOtherLookup = async (
  params: PricingMatrixOtherLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly PricingMatrixOtherLookupDto[]> => {
  const body = await customFetch<unknown>(
    pricingMatrixOtherLookupEndpoint(params),
    { signal },
  );
  return pricingMatrixOtherLookupResponseSchema.parse(body).data;
};

export const pricingMatrixOtherListQueryOptions = (
  params: PricingMatrixOtherListParams = {},
) =>
  queryOptions({
    queryKey: pricingMatrixOtherKeys.list(params),
    queryFn: ({ signal }) => loadPricingMatrixOthers(params, { signal }),
    meta: { feature: 'pricing-matrix-other', operation: 'list' },
  });

export const pricingMatrixOtherDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: pricingMatrixOtherKeys.detail(id),
    queryFn: ({ signal }) => loadPricingMatrixOther(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix-other', operation: 'detail' },
  });

export const pricingMatrixOtherLookupQueryOptions = (
  params: PricingMatrixOtherLookupParams = {},
) => {
  const resolved: PricingMatrixOtherLookupParams = {
    activeOnly: params.activeOnly ?? true,
    pricingMatrixId: params.pricingMatrixId,
  };
  return queryOptions({
    queryKey: pricingMatrixOtherKeys.lookup(resolved),
    queryFn: ({ signal }) => loadPricingMatrixOtherLookup(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix-other', operation: 'lookup' },
  });
};
