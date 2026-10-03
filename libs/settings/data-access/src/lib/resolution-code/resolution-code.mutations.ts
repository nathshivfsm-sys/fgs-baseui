import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  resolutionCodeDetailResponseSchema,
  type ResolutionCodeCreateDto,
  type ResolutionCodeDetailDto,
  type ResolutionCodePatchDto,
  type ResolutionCodeUpdateDto,
} from '@cms/settings-contract';
import {
  resolutionCodeCollectionEndpoint,
  resolutionCodeDetailEndpoint,
} from './resolution-code.endpoints';
import { resolutionCodeKeys } from './resolution-code.keys';

async function parseResolutionCodeDetail(
  body: unknown,
): Promise<ResolutionCodeDetailDto> {
  return resolutionCodeDetailResponseSchema.parse(body).data;
}

export const createResolutionCode = async (
  body: ResolutionCodeCreateDto,
  context?: QueryRequestContext,
): Promise<ResolutionCodeDetailDto> => {
  const response = await customFetch<unknown>(
    resolutionCodeCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseResolutionCodeDetail(response);
};

export const updateResolutionCode = async (
  id: number,
  body: ResolutionCodeUpdateDto,
  context?: QueryRequestContext,
): Promise<ResolutionCodeDetailDto> => {
  const response = await customFetch<unknown>(
    resolutionCodeDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseResolutionCodeDetail(response);
};

export const patchResolutionCode = async (
  id: number,
  body: ResolutionCodePatchDto,
  context?: QueryRequestContext,
): Promise<ResolutionCodeDetailDto> => {
  const response = await customFetch<unknown>(
    resolutionCodeDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseResolutionCodeDetail(response);
};

function invalidateResolutionCodes(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: resolutionCodeKeys.all });
}

export const createResolutionCodeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: ResolutionCodeCreateDto) => createResolutionCode(body),
    meta: { feature: 'resolution-code', operation: 'create' },
    onSuccess: () => invalidateResolutionCodes(queryClient),
  });

export const updateResolutionCodeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: ResolutionCodeUpdateDto }) =>
      updateResolutionCode(id, body),
    meta: { feature: 'resolution-code', operation: 'update' },
    onSuccess: () => invalidateResolutionCodes(queryClient),
  });

export const patchResolutionCodeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: ResolutionCodePatchDto }) =>
      patchResolutionCode(id, body),
    meta: { feature: 'resolution-code', operation: 'patch' },
    onSuccess: () => invalidateResolutionCodes(queryClient),
  });
