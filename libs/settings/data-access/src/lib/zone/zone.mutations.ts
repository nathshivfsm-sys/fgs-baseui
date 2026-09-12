import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  zoneDetailResponseSchema,
  type ZoneCreateDto,
  type ZoneDetailDto,
  type ZonePatchDto,
  type ZoneUpdateDto,
} from '@cms/settings-contract';
import {
  zoneCollectionEndpoint,
  zoneDetailEndpoint,
} from './zone.endpoints';
import { zoneKeys } from './zone.keys';

async function parseZoneDetail(body: unknown): Promise<ZoneDetailDto> {
  return zoneDetailResponseSchema.parse(body).data;
}

export const createZone = async (
  body: ZoneCreateDto,
  context?: QueryRequestContext,
): Promise<ZoneDetailDto> => {
  const response = await customFetch<unknown>(zoneCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseZoneDetail(response);
};

export const updateZone = async (
  id: number,
  body: ZoneUpdateDto,
  context?: QueryRequestContext,
): Promise<ZoneDetailDto> => {
  const response = await customFetch<unknown>(zoneDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseZoneDetail(response);
};

export const patchZone = async (
  id: number,
  body: ZonePatchDto,
  context?: QueryRequestContext,
): Promise<ZoneDetailDto> => {
  const response = await customFetch<unknown>(zoneDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseZoneDetail(response);
};

function invalidateZones(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: zoneKeys.all });
}

export const createZoneMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: ZoneCreateDto) => createZone(body),
    meta: { feature: 'zone', operation: 'create' },
    onSuccess: () => invalidateZones(queryClient),
  });

export const updateZoneMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: ZoneUpdateDto }) =>
      updateZone(id, body),
    meta: { feature: 'zone', operation: 'update' },
    onSuccess: () => invalidateZones(queryClient),
  });

export const patchZoneMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: ZonePatchDto }) =>
      patchZone(id, body),
    meta: { feature: 'zone', operation: 'patch' },
    onSuccess: () => invalidateZones(queryClient),
  });
