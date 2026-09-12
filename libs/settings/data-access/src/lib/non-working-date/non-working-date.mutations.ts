import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  nonWorkingDateDetailResponseSchema,
  type NonWorkingDateCreateDto,
  type NonWorkingDateDetailDto,
  type NonWorkingDatePatchDto,
  type NonWorkingDateUpdateDto,
} from '@cms/settings-contract';
import {
  nonWorkingDateCollectionEndpoint,
  nonWorkingDateDetailEndpoint,
} from './non-working-date.endpoints';
import { nonWorkingDateKeys } from './non-working-date.keys';

async function parseNonWorkingDateDetail(
  body: unknown,
): Promise<NonWorkingDateDetailDto> {
  return nonWorkingDateDetailResponseSchema.parse(body).data;
}

export const createNonWorkingDate = async (
  body: NonWorkingDateCreateDto,
  context?: QueryRequestContext,
): Promise<NonWorkingDateDetailDto> => {
  const response = await customFetch<unknown>(nonWorkingDateCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseNonWorkingDateDetail(response);
};

export const updateNonWorkingDate = async (
  id: number,
  body: NonWorkingDateUpdateDto,
  context?: QueryRequestContext,
): Promise<NonWorkingDateDetailDto> => {
  const response = await customFetch<unknown>(nonWorkingDateDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseNonWorkingDateDetail(response);
};

export const patchNonWorkingDate = async (
  id: number,
  body: NonWorkingDatePatchDto,
  context?: QueryRequestContext,
): Promise<NonWorkingDateDetailDto> => {
  const response = await customFetch<unknown>(nonWorkingDateDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseNonWorkingDateDetail(response);
};

function invalidateNonWorkingDates(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: nonWorkingDateKeys.all });
}

export const createNonWorkingDateMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: NonWorkingDateCreateDto) => createNonWorkingDate(body),
    meta: { feature: 'non-working-date', operation: 'create' },
    onSuccess: () => invalidateNonWorkingDates(queryClient),
  });

export const updateNonWorkingDateMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: NonWorkingDateUpdateDto;
    }) => updateNonWorkingDate(id, body),
    meta: { feature: 'non-working-date', operation: 'update' },
    onSuccess: () => invalidateNonWorkingDates(queryClient),
  });

export const patchNonWorkingDateMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: NonWorkingDatePatchDto;
    }) => patchNonWorkingDate(id, body),
    meta: { feature: 'non-working-date', operation: 'patch' },
    onSuccess: () => invalidateNonWorkingDates(queryClient),
  });
