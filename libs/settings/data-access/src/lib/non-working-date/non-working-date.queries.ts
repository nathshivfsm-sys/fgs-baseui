import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  nonWorkingDateDetailResponseSchema,
  nonWorkingDateListResponseSchema,
  nonWorkingDateLookupResponseSchema,
  type NonWorkingDateDetailDto,
  type NonWorkingDateListParams,
  type NonWorkingDateLookupDto,
  type NonWorkingDateSummaryDto,
  type PagedResult,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  nonWorkingDateDetailEndpoint,
  nonWorkingDateListEndpoint,
  nonWorkingDateLookupEndpoint,
} from './non-working-date.endpoints';
import { nonWorkingDateKeys } from './non-working-date.keys';

export const loadNonWorkingDates = async (
  params: NonWorkingDateListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<NonWorkingDateSummaryDto>> => {
  const body = await customFetch<unknown>(nonWorkingDateListEndpoint(params), {
    signal,
  });
  return toPagedResult(nonWorkingDateListResponseSchema.parse(body).data);
};

export const loadNonWorkingDate = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<NonWorkingDateDetailDto> => {
  const body = await customFetch<unknown>(nonWorkingDateDetailEndpoint(id), {
    signal,
  });
  return nonWorkingDateDetailResponseSchema.parse(body).data;
};

export const loadNonWorkingDateLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly NonWorkingDateLookupDto[]> => {
  const body = await customFetch<unknown>(
    nonWorkingDateLookupEndpoint(activeOnly),
    { signal },
  );
  return nonWorkingDateLookupResponseSchema.parse(body).data;
};

export const nonWorkingDateListQueryOptions = (
  params: NonWorkingDateListParams = {},
) =>
  queryOptions({
    queryKey: nonWorkingDateKeys.list(params),
    queryFn: ({ signal }) => loadNonWorkingDates(params, { signal }),
    meta: { feature: 'non-working-date', operation: 'list' },
  });

export const nonWorkingDateDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: nonWorkingDateKeys.detail(id),
    queryFn: ({ signal }) => loadNonWorkingDate(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'non-working-date', operation: 'detail' },
  });

export const nonWorkingDateLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: nonWorkingDateKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadNonWorkingDateLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'non-working-date', operation: 'lookup' },
  });
