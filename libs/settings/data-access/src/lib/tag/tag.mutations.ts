import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  tagDetailResponseSchema,
  type TagCreateDto,
  type TagDetailDto,
  type TagPatchDto,
  type TagUpdateDto,
} from '@cms/settings-contract';
import { tagCollectionEndpoint, tagDetailEndpoint } from './tag.endpoints';
import { tagKeys } from './tag.keys';

async function parseTagDetail(body: unknown): Promise<TagDetailDto> {
  return tagDetailResponseSchema.parse(body).data;
}

export const createTag = async (
  body: TagCreateDto,
  context?: QueryRequestContext,
): Promise<TagDetailDto> => {
  const response = await customFetch<unknown>(tagCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTagDetail(response);
};

export const updateTag = async (
  id: number,
  body: TagUpdateDto,
  context?: QueryRequestContext,
): Promise<TagDetailDto> => {
  const response = await customFetch<unknown>(tagDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTagDetail(response);
};

export const patchTag = async (
  id: number,
  body: TagPatchDto,
  context?: QueryRequestContext,
): Promise<TagDetailDto> => {
  const response = await customFetch<unknown>(tagDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseTagDetail(response);
};

function invalidateTags(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: tagKeys.all });
}

export const createTagMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: TagCreateDto) => createTag(body),
    meta: { feature: 'tag', operation: 'create' },
    onSuccess: () => invalidateTags(queryClient),
  });

export const updateTagMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TagUpdateDto }) =>
      updateTag(id, body),
    meta: { feature: 'tag', operation: 'update' },
    onSuccess: () => invalidateTags(queryClient),
  });

export const patchTagMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TagPatchDto }) =>
      patchTag(id, body),
    meta: { feature: 'tag', operation: 'patch' },
    onSuccess: () => invalidateTags(queryClient),
  });
