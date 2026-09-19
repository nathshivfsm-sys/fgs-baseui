import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  glBreakDetailResponseSchema,
  type GlBreakCreateDto,
  type GlBreakDetailDto,
  type GlBreakPatchDto,
  type GlBreakUpdateDto,
} from '@cms/settings-contract';
import {
  glBreakCollectionEndpoint,
  glBreakDetailEndpoint,
} from './gl-break.endpoints';
import { glBreakKeys } from './gl-break.keys';

async function parseGlBreakDetail(body: unknown): Promise<GlBreakDetailDto> {
  return glBreakDetailResponseSchema.parse(body).data;
}

export const createGlBreak = async (
  body: GlBreakCreateDto,
  context?: QueryRequestContext,
): Promise<GlBreakDetailDto> => {
  const response = await customFetch<unknown>(glBreakCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseGlBreakDetail(response);
};

export const updateGlBreak = async (
  id: number,
  body: GlBreakUpdateDto,
  context?: QueryRequestContext,
): Promise<GlBreakDetailDto> => {
  const response = await customFetch<unknown>(glBreakDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseGlBreakDetail(response);
};

export const patchGlBreak = async (
  id: number,
  body: GlBreakPatchDto,
  context?: QueryRequestContext,
): Promise<GlBreakDetailDto> => {
  const response = await customFetch<unknown>(glBreakDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseGlBreakDetail(response);
};

function invalidateGlBreaks(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: glBreakKeys.all });
}

export const createGlBreakMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: GlBreakCreateDto) => createGlBreak(body),
    meta: { feature: 'gl-break', operation: 'create' },
    onSuccess: () => invalidateGlBreaks(queryClient),
  });

export const updateGlBreakMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: GlBreakUpdateDto }) =>
      updateGlBreak(id, body),
    meta: { feature: 'gl-break', operation: 'update' },
    onSuccess: () => invalidateGlBreaks(queryClient),
  });

export const patchGlBreakMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: GlBreakPatchDto }) =>
      patchGlBreak(id, body),
    meta: { feature: 'gl-break', operation: 'patch' },
    onSuccess: () => invalidateGlBreaks(queryClient),
  });
