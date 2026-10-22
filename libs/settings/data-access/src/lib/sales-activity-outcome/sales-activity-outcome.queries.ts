import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  salesActivityOutcomeDetailResponseSchema,
  salesActivityOutcomeListResponseSchema,
  salesActivityOutcomeLookupResponseSchema,
  type PagedResult,
  type SalesActivityOutcomeDetailDto,
  type SalesActivityOutcomeListParams,
  type SalesActivityOutcomeLookupDto,
  type SalesActivityOutcomeSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  salesActivityOutcomeDetailEndpoint,
  salesActivityOutcomeListEndpoint,
  salesActivityOutcomeLookupEndpoint,
} from './sales-activity-outcome.endpoints';
import { salesActivityOutcomeKeys } from './sales-activity-outcome.keys';

export const loadSalesActivityOutcomes = async (
  params: SalesActivityOutcomeListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<SalesActivityOutcomeSummaryDto>> => {
  const body = await customFetch<unknown>(
    salesActivityOutcomeListEndpoint(params),
    { signal },
  );
  return toPagedResult(salesActivityOutcomeListResponseSchema.parse(body).data);
};

export const loadSalesActivityOutcome = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<SalesActivityOutcomeDetailDto> => {
  const body = await customFetch<unknown>(
    salesActivityOutcomeDetailEndpoint(id),
    { signal },
  );
  return salesActivityOutcomeDetailResponseSchema.parse(body).data;
};

export const loadSalesActivityOutcomeLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly SalesActivityOutcomeLookupDto[]> => {
  const body = await customFetch<unknown>(
    salesActivityOutcomeLookupEndpoint(activeOnly),
    { signal },
  );
  return salesActivityOutcomeLookupResponseSchema.parse(body).data;
};

export const salesActivityOutcomeListQueryOptions = (
  params: SalesActivityOutcomeListParams = {},
) =>
  queryOptions({
    queryKey: salesActivityOutcomeKeys.list(params),
    queryFn: ({ signal }) => loadSalesActivityOutcomes(params, { signal }),
    meta: { feature: 'sales-activity-outcome', operation: 'list' },
  });

export const salesActivityOutcomeDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: salesActivityOutcomeKeys.detail(id),
    queryFn: ({ signal }) => loadSalesActivityOutcome(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'sales-activity-outcome', operation: 'detail' },
  });

export const salesActivityOutcomeLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: salesActivityOutcomeKeys.lookup(activeOnly),
    queryFn: ({ signal }) =>
      loadSalesActivityOutcomeLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'sales-activity-outcome', operation: 'lookup' },
  });
