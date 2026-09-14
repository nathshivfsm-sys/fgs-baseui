import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  postalCodeDetailResponseSchema,
  postalCodeListResponseSchema,
  postalCodeLookupResponseSchema,
  type PagedResult,
  type PostalCodeDetailDto,
  type PostalCodeListParams,
  type PostalCodeLookupDto,
  type PostalCodeSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  postalCodeDetailEndpoint,
  postalCodeListEndpoint,
  postalCodeLookupEndpoint,
} from './postal-code.endpoints';
import { postalCodeKeys } from './postal-code.keys';

export const loadPostalCodes = async (
  params: PostalCodeListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PostalCodeSummaryDto>> => {
  const body = await customFetch<unknown>(postalCodeListEndpoint(params), {
    signal,
  });
  return toPagedResult(postalCodeListResponseSchema.parse(body).data);
};

export const loadPostalCode = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PostalCodeDetailDto> => {
  const body = await customFetch<unknown>(postalCodeDetailEndpoint(id), {
    signal,
  });
  return postalCodeDetailResponseSchema.parse(body).data;
};

export const loadPostalCodeLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly PostalCodeLookupDto[]> => {
  const body = await customFetch<unknown>(
    postalCodeLookupEndpoint(activeOnly),
    { signal },
  );
  return postalCodeLookupResponseSchema.parse(body).data;
};

export const postalCodeListQueryOptions = (
  params: PostalCodeListParams = {},
) =>
  queryOptions({
    queryKey: postalCodeKeys.list(params),
    queryFn: ({ signal }) => loadPostalCodes(params, { signal }),
    meta: { feature: 'postalcode', operation: 'list' },
  });

export const postalCodeDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: postalCodeKeys.detail(id),
    queryFn: ({ signal }) => loadPostalCode(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'postalcode', operation: 'detail' },
  });

export const postalCodeLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: postalCodeKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadPostalCodeLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'postalcode', operation: 'lookup' },
  });
