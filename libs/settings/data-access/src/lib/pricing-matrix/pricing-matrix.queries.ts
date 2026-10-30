import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixDetailResponseSchema,
  pricingMatrixListResponseSchema,
  pricingMatrixLookupResponseSchema,
  type PagedResult,
  type PricingMatrixDetailDto,
  type PricingMatrixListParams,
  type PricingMatrixLookupDto,
  type PricingMatrixSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  pricingMatrixDetailEndpoint,
  pricingMatrixListEndpoint,
  pricingMatrixLookupEndpoint,
} from './pricing-matrix.endpoints';
import { pricingMatrixKeys } from './pricing-matrix.keys';

export const loadPricingMatrices = async (
  params: PricingMatrixListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PricingMatrixSummaryDto>> => {
  const body = await customFetch<unknown>(pricingMatrixListEndpoint(params), {
    signal,
  });
  return toPagedResult(pricingMatrixListResponseSchema.parse(body).data);
};

export const loadPricingMatrix = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PricingMatrixDetailDto> => {
  const body = await customFetch<unknown>(pricingMatrixDetailEndpoint(id), {
    signal,
  });
  return pricingMatrixDetailResponseSchema.parse(body).data;
};

export const loadPricingMatrixLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly PricingMatrixLookupDto[]> => {
  const body = await customFetch<unknown>(
    pricingMatrixLookupEndpoint(activeOnly),
    { signal },
  );
  return pricingMatrixLookupResponseSchema.parse(body).data;
};

export const pricingMatrixListQueryOptions = (
  params: PricingMatrixListParams = {},
) =>
  queryOptions({
    queryKey: pricingMatrixKeys.list(params),
    queryFn: ({ signal }) => loadPricingMatrices(params, { signal }),
    meta: { feature: 'pricing-matrix', operation: 'list' },
  });

export const pricingMatrixDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: pricingMatrixKeys.detail(id),
    queryFn: ({ signal }) => loadPricingMatrix(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix', operation: 'detail' },
  });

export const pricingMatrixLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: pricingMatrixKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadPricingMatrixLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix', operation: 'lookup' },
  });
