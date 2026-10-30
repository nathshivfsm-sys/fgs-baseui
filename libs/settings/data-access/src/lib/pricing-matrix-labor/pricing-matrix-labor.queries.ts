import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  pricingMatrixLaborDetailResponseSchema,
  pricingMatrixLaborListResponseSchema,
  pricingMatrixLaborLookupResponseSchema,
  type PagedResult,
  type PricingMatrixLaborDetailDto,
  type PricingMatrixLaborListParams,
  type PricingMatrixLaborLookupDto,
  type PricingMatrixLaborLookupParams,
  type PricingMatrixLaborSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  pricingMatrixLaborDetailEndpoint,
  pricingMatrixLaborListEndpoint,
  pricingMatrixLaborLookupEndpoint,
} from './pricing-matrix-labor.endpoints';
import { pricingMatrixLaborKeys } from './pricing-matrix-labor.keys';

export const loadPricingMatrixLabors = async (
  params: PricingMatrixLaborListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PricingMatrixLaborSummaryDto>> => {
  const body = await customFetch<unknown>(
    pricingMatrixLaborListEndpoint(params),
    { signal },
  );
  return toPagedResult(pricingMatrixLaborListResponseSchema.parse(body).data);
};

export const loadPricingMatrixLabor = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PricingMatrixLaborDetailDto> => {
  const body = await customFetch<unknown>(
    pricingMatrixLaborDetailEndpoint(id),
    { signal },
  );
  return pricingMatrixLaborDetailResponseSchema.parse(body).data;
};

export const loadPricingMatrixLaborLookup = async (
  params: PricingMatrixLaborLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly PricingMatrixLaborLookupDto[]> => {
  const body = await customFetch<unknown>(
    pricingMatrixLaborLookupEndpoint(params),
    { signal },
  );
  return pricingMatrixLaborLookupResponseSchema.parse(body).data;
};

export const pricingMatrixLaborListQueryOptions = (
  params: PricingMatrixLaborListParams = {},
) =>
  queryOptions({
    queryKey: pricingMatrixLaborKeys.list(params),
    queryFn: ({ signal }) => loadPricingMatrixLabors(params, { signal }),
    meta: { feature: 'pricing-matrix-labor', operation: 'list' },
  });

export const pricingMatrixLaborDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: pricingMatrixLaborKeys.detail(id),
    queryFn: ({ signal }) => loadPricingMatrixLabor(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix-labor', operation: 'detail' },
  });

export const pricingMatrixLaborLookupQueryOptions = (
  params: PricingMatrixLaborLookupParams = {},
) => {
  const resolved: PricingMatrixLaborLookupParams = {
    activeOnly: params.activeOnly ?? true,
    pricingMatrixId: params.pricingMatrixId,
  };
  return queryOptions({
    queryKey: pricingMatrixLaborKeys.lookup(resolved),
    queryFn: ({ signal }) => loadPricingMatrixLaborLookup(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'pricing-matrix-labor', operation: 'lookup' },
  });
};
