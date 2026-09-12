import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  zoneDetailResponseSchema,
  zoneListResponseSchema,
  zoneLookupResponseSchema,
  type PagedResult,
  type ZoneDetailDto,
  type ZoneListParams,
  type ZoneLookupDto,
  type ZoneSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  zoneDetailEndpoint,
  zoneListEndpoint,
  zoneLookupEndpoint,
} from './zone.endpoints';
import { zoneKeys } from './zone.keys';

export const loadZones = async (
  params: ZoneListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<ZoneSummaryDto>> => {
  const body = await customFetch<unknown>(zoneListEndpoint(params), {
    signal,
  });
  return toPagedResult(zoneListResponseSchema.parse(body).data);
};

export const loadZone = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<ZoneDetailDto> => {
  const body = await customFetch<unknown>(zoneDetailEndpoint(id), {
    signal,
  });
  return zoneDetailResponseSchema.parse(body).data;
};

export const loadZoneLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly ZoneLookupDto[]> => {
  const body = await customFetch<unknown>(zoneLookupEndpoint(activeOnly), {
    signal,
  });
  return zoneLookupResponseSchema.parse(body).data;
};

export const zoneListQueryOptions = (params: ZoneListParams = {}) =>
  queryOptions({
    queryKey: zoneKeys.list(params),
    queryFn: ({ signal }) => loadZones(params, { signal }),
    meta: { feature: 'zone', operation: 'list' },
  });

export const zoneDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: zoneKeys.detail(id),
    queryFn: ({ signal }) => loadZone(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'zone', operation: 'detail' },
  });

export const zoneLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: zoneKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadZoneLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'zone', operation: 'lookup' },
  });
