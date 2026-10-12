import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  sourceDetailResponseSchema,
  type SourceCreateDto,
  type SourceDetailDto,
  type SourcePatchDto,
  type SourceUpdateDto,
} from '@cms/settings-contract';
import {
  sourceCollectionEndpoint,
  sourceDetailEndpoint,
} from './source.endpoints';
import { sourceKeys } from './source.keys';

async function parseSourceDetail(body: unknown): Promise<SourceDetailDto> {
  return sourceDetailResponseSchema.parse(body).data;
}

export const createSource = async (
  body: SourceCreateDto,
  context?: QueryRequestContext,
): Promise<SourceDetailDto> => {
  const response = await customFetch<unknown>(sourceCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseSourceDetail(response);
};

export const updateSource = async (
  id: number,
  body: SourceUpdateDto,
  context?: QueryRequestContext,
): Promise<SourceDetailDto> => {
  const response = await customFetch<unknown>(sourceDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseSourceDetail(response);
};

export const patchSource = async (
  id: number,
  body: SourcePatchDto,
  context?: QueryRequestContext,
): Promise<SourceDetailDto> => {
  const response = await customFetch<unknown>(sourceDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseSourceDetail(response);
};

function invalidateSources(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: sourceKeys.all });
}

export const createSourceMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: SourceCreateDto) => createSource(body),
    meta: { feature: 'source', operation: 'create' },
    onSuccess: () => invalidateSources(queryClient),
  });

export const updateSourceMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: SourceUpdateDto }) =>
      updateSource(id, body),
    meta: { feature: 'source', operation: 'update' },
    onSuccess: () => invalidateSources(queryClient),
  });

export const patchSourceMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: SourcePatchDto }) =>
      patchSource(id, body),
    meta: { feature: 'source', operation: 'patch' },
    onSuccess: () => invalidateSources(queryClient),
  });
