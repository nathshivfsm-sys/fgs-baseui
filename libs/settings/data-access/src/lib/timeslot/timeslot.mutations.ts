import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  timeslotDetailResponseSchema,
  type TimeslotCreateDto,
  type TimeslotDetailDto,
  type TimeslotPatchDto,
  type TimeslotUpdateDto,
} from '@cms/settings-contract';
import {
  timeslotCollectionEndpoint,
  timeslotDetailEndpoint,
} from './timeslot.endpoints';
import { timeslotKeys } from './timeslot.keys';

async function parseTimeslotDetail(body: unknown): Promise<TimeslotDetailDto> {
  return timeslotDetailResponseSchema.parse(body).data;
}

export const createTimeslot = async (
  body: TimeslotCreateDto,
  context?: QueryRequestContext,
): Promise<TimeslotDetailDto> => {
  const response = await customFetch<unknown>(timeslotCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTimeslotDetail(response);
};

export const updateTimeslot = async (
  id: number,
  body: TimeslotUpdateDto,
  context?: QueryRequestContext,
): Promise<TimeslotDetailDto> => {
  const response = await customFetch<unknown>(timeslotDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTimeslotDetail(response);
};

export const patchTimeslot = async (
  id: number,
  body: TimeslotPatchDto,
  context?: QueryRequestContext,
): Promise<TimeslotDetailDto> => {
  const response = await customFetch<unknown>(timeslotDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTimeslotDetail(response);
};

function invalidateTimeslots(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: timeslotKeys.all });
}

export const createTimeslotMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: TimeslotCreateDto) => createTimeslot(body),
    meta: { feature: 'timeslot', operation: 'create' },
    onSuccess: () => invalidateTimeslots(queryClient),
  });

export const updateTimeslotMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TimeslotUpdateDto }) =>
      updateTimeslot(id, body),
    meta: { feature: 'timeslot', operation: 'update' },
    onSuccess: () => invalidateTimeslots(queryClient),
  });

export const patchTimeslotMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TimeslotPatchDto }) =>
      patchTimeslot(id, body),
    meta: { feature: 'timeslot', operation: 'patch' },
    onSuccess: () => invalidateTimeslots(queryClient),
  });
