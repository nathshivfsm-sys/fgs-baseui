import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  resolutionCodeDetailResponseSchema,
  resolutionCodeListResponseSchema,
  resolutionCodeLookupResponseSchema,
  type PagedResult,
  type ResolutionCodeDetailDto,
  type ResolutionCodeListParams,
  type ResolutionCodeLookupDto,
  type ResolutionCodeLookupParams,
  type ResolutionCodeSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  resolutionCodeDetailEndpoint,
  resolutionCodeListEndpoint,
  resolutionCodeLookupEndpoint,
} from './resolution-code.endpoints';
import { resolutionCodeKeys } from './resolution-code.keys';

export const loadResolutionCodes = async (
  params: ResolutionCodeListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<ResolutionCodeSummaryDto>> => {
  const body = await customFetch<unknown>(resolutionCodeListEndpoint(params), {
    signal,
  });
  return toPagedResult(resolutionCodeListResponseSchema.parse(body).data);
};

export const loadResolutionCode = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<ResolutionCodeDetailDto> => {
  const body = await customFetch<unknown>(resolutionCodeDetailEndpoint(id), {
    signal,
  });
  return resolutionCodeDetailResponseSchema.parse(body).data;
};

export const loadResolutionCodeLookup = async (
  params: ResolutionCodeLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly ResolutionCodeLookupDto[]> => {
  const body = await customFetch<unknown>(
    resolutionCodeLookupEndpoint(params),
    { signal },
  );
  return resolutionCodeLookupResponseSchema.parse(body).data;
};

export const resolutionCodeListQueryOptions = (
  params: ResolutionCodeListParams = {},
) =>
  queryOptions({
    queryKey: resolutionCodeKeys.list(params),
    queryFn: ({ signal }) => loadResolutionCodes(params, { signal }),
    meta: { feature: 'resolution-code', operation: 'list' },
  });

export const resolutionCodeDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: resolutionCodeKeys.detail(id),
    queryFn: ({ signal }) => loadResolutionCode(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'resolution-code', operation: 'detail' },
  });

export const resolutionCodeLookupQueryOptions = (
  params: ResolutionCodeLookupParams = {},
) => {
  const resolved: ResolutionCodeLookupParams = {
    activeOnly: params.activeOnly ?? true,
    isMobileVisible: params.isMobileVisible,
  };
  return queryOptions({
    queryKey: resolutionCodeKeys.lookup(resolved),
    queryFn: ({ signal }) => loadResolutionCodeLookup(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'resolution-code', operation: 'lookup' },
  });
};
