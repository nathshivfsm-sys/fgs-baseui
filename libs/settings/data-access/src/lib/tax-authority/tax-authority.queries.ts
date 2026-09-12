import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  taxAuthorityDetailResponseSchema,
  taxAuthorityListResponseSchema,
  taxAuthorityLookupResponseSchema,
  type PagedResult,
  type TaxAuthorityDetailDto,
  type TaxAuthorityListParams,
  type TaxAuthorityLookupDto,
  type TaxAuthoritySummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  taxAuthorityDetailEndpoint,
  taxAuthorityListEndpoint,
  taxAuthorityLookupEndpoint,
} from './tax-authority.endpoints';
import { taxAuthorityKeys } from './tax-authority.keys';

export const loadTaxAuthorities = async (
  params: TaxAuthorityListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<TaxAuthoritySummaryDto>> => {
  const body = await customFetch<unknown>(taxAuthorityListEndpoint(params), {
    signal,
  });
  return toPagedResult(taxAuthorityListResponseSchema.parse(body).data);
};

export const loadTaxAuthority = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<TaxAuthorityDetailDto> => {
  const body = await customFetch<unknown>(taxAuthorityDetailEndpoint(id), {
    signal,
  });
  return taxAuthorityDetailResponseSchema.parse(body).data;
};

export const loadTaxAuthorityLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly TaxAuthorityLookupDto[]> => {
  const body = await customFetch<unknown>(
    taxAuthorityLookupEndpoint(activeOnly),
    { signal },
  );
  return taxAuthorityLookupResponseSchema.parse(body).data;
};

export const taxAuthorityListQueryOptions = (
  params: TaxAuthorityListParams = {},
) =>
  queryOptions({
    queryKey: taxAuthorityKeys.list(params),
    queryFn: ({ signal }) => loadTaxAuthorities(params, { signal }),
    meta: { feature: 'tax-authority', operation: 'list' },
  });

export const taxAuthorityDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: taxAuthorityKeys.detail(id),
    queryFn: ({ signal }) => loadTaxAuthority(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tax-authority', operation: 'detail' },
  });

export const taxAuthorityLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: taxAuthorityKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadTaxAuthorityLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tax-authority', operation: 'lookup' },
  });
