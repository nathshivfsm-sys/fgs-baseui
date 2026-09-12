import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  taxDetailResponseSchema,
  taxListResponseSchema,
  taxLookupResponseSchema,
  type PagedResult,
  type TaxDetailDto,
  type TaxListParams,
  type TaxLookupDto,
  type TaxSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  taxDetailEndpoint,
  taxListEndpoint,
  taxLookupEndpoint,
} from './tax.endpoints';
import { taxKeys } from './tax.keys';

export const loadTaxes = async (
  params: TaxListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<TaxSummaryDto>> => {
  const body = await customFetch<unknown>(taxListEndpoint(params), {
    signal,
  });
  return toPagedResult(taxListResponseSchema.parse(body).data);
};

export const loadTax = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<TaxDetailDto> => {
  const body = await customFetch<unknown>(taxDetailEndpoint(id), {
    signal,
  });
  return taxDetailResponseSchema.parse(body).data;
};

export const loadTaxLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly TaxLookupDto[]> => {
  const body = await customFetch<unknown>(taxLookupEndpoint(activeOnly), {
    signal,
  });
  return taxLookupResponseSchema.parse(body).data;
};

export const taxListQueryOptions = (params: TaxListParams = {}) =>
  queryOptions({
    queryKey: taxKeys.list(params),
    queryFn: ({ signal }) => loadTaxes(params, { signal }),
    meta: { feature: 'tax', operation: 'list' },
  });

export const taxDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: taxKeys.detail(id),
    queryFn: ({ signal }) => loadTax(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tax', operation: 'detail' },
  });

export const taxLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: taxKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadTaxLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tax', operation: 'lookup' },
  });
