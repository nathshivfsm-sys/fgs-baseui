import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  nonWorkingDateDetailResponseSchema,
  type NonWorkingDateCreateDto,
  type NonWorkingDateDetailDto,
  type NonWorkingDatePatchDto,
  type NonWorkingDateSummaryDto,
  type NonWorkingDateUpdateDto,
  type PagedResult,
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

export const deleteNonWorkingDate = async (
  id: number,
  context?: QueryRequestContext,
): Promise<void> => {
  await customFetch<unknown>(nonWorkingDateDetailEndpoint(id), {
    method: 'DELETE',
    signal: context?.signal,
  });
};

function byDate(left: NonWorkingDateSummaryDto, right: NonWorkingDateSummaryDto) {
  return left.nonWorkingDate.localeCompare(right.nonWorkingDate);
}

function upsertIntoPagedList(
  current: PagedResult<NonWorkingDateSummaryDto> | undefined,
  record: NonWorkingDateSummaryDto,
  mode: 'create' | 'update',
): PagedResult<NonWorkingDateSummaryDto> | undefined {
  if (!current) return current;
  const exists = current.items.some((item) => item.id === record.id);
  if (mode === 'update' || exists) {
    return {
      ...current,
      items: current.items.map((item) =>
        item.id === record.id ? record : item,
      ),
    };
  }
  return {
    ...current,
    items: [...current.items, record].sort(byDate).slice(0, current.pageSize),
    totalCount: current.totalCount + 1,
  };
}

function removeFromPagedList(
  current: PagedResult<NonWorkingDateSummaryDto> | undefined,
  id: number,
): PagedResult<NonWorkingDateSummaryDto> | undefined {
  if (!current) return current;
  return {
    ...current,
    items: current.items.filter((item) => item.id !== id),
    totalCount: Math.max(0, current.totalCount - 1),
  };
}

function applyWriteToCache(
  queryClient: QueryClient,
  record: NonWorkingDateDetailDto,
  mode: 'create' | 'update',
) {
  queryClient.setQueryData(nonWorkingDateKeys.detail(record.id), record);
  queryClient.setQueriesData<PagedResult<NonWorkingDateSummaryDto>>(
    { queryKey: nonWorkingDateKeys.lists() },
    (current) => upsertIntoPagedList(current, record, mode),
  );
}

export const createNonWorkingDateMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: NonWorkingDateCreateDto) => createNonWorkingDate(body),
    meta: { feature: 'non-working-date', operation: 'create' },
    onSuccess: (created) => applyWriteToCache(queryClient, created, 'create'),
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
    onSuccess: (updated) => applyWriteToCache(queryClient, updated, 'update'),
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
    onSuccess: (updated) => applyWriteToCache(queryClient, updated, 'update'),
  });

export const deleteNonWorkingDateMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (id: number) => deleteNonWorkingDate(id),
    meta: { feature: 'non-working-date', operation: 'delete' },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: nonWorkingDateKeys.detail(id) });
      queryClient.setQueriesData<PagedResult<NonWorkingDateSummaryDto>>(
        { queryKey: nonWorkingDateKeys.lists() },
        (current) => removeFromPagedList(current, id),
      );
    },
  });
