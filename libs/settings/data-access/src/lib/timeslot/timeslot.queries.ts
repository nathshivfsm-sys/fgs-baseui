import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  timeslotDetailResponseSchema,
  timeslotListResponseSchema,
  timeslotLookupResponseSchema,
  type PagedResult,
  type TimeslotDetailDto,
  type TimeslotListParams,
  type TimeslotLookupDto,
  type TimeslotLookupParams,
  type TimeslotSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  timeslotDetailEndpoint,
  timeslotListEndpoint,
  timeslotLookupEndpoint,
} from './timeslot.endpoints';
import { timeslotKeys } from './timeslot.keys';

export const loadTimeslots = async (
  params: TimeslotListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<TimeslotSummaryDto>> => {
  const body = await customFetch<unknown>(timeslotListEndpoint(params), {
    signal,
  });
  return toPagedResult(timeslotListResponseSchema.parse(body).data);
};

export const loadTimeslot = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<TimeslotDetailDto> => {
  const body = await customFetch<unknown>(timeslotDetailEndpoint(id), {
    signal,
  });
  return timeslotDetailResponseSchema.parse(body).data;
};

export const loadTimeslotLookup = async (
  params: TimeslotLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly TimeslotLookupDto[]> => {
  const body = await customFetch<unknown>(timeslotLookupEndpoint(params), {
    signal,
  });
  return timeslotLookupResponseSchema.parse(body).data;
};

export const timeslotListQueryOptions = (params: TimeslotListParams = {}) =>
  queryOptions({
    queryKey: timeslotKeys.list(params),
    queryFn: ({ signal }) => loadTimeslots(params, { signal }),
    meta: { feature: 'timeslot', operation: 'list' },
  });

export const timeslotDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: timeslotKeys.detail(id),
    queryFn: ({ signal }) => loadTimeslot(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'timeslot', operation: 'detail' },
  });

export const timeslotLookupQueryOptions = (
  params: TimeslotLookupParams = {},
) => {
  const resolved: TimeslotLookupParams = {
    activeOnly: params.activeOnly ?? true,
    isMobileVisible: params.isMobileVisible,
    isCustomerPortalVisible: params.isCustomerPortalVisible,
  };
  return queryOptions({
    queryKey: timeslotKeys.lookup(resolved),
    queryFn: ({ signal }) => loadTimeslotLookup(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'timeslot', operation: 'lookup' },
  });
};
