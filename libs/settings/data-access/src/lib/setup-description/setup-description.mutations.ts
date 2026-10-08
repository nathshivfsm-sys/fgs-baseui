import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  setupDescriptionDetailResponseSchema,
  type SetupDescriptionCreateDto,
  type SetupDescriptionDetailDto,
  type SetupDescriptionPatchDto,
  type SetupDescriptionUpdateDto,
} from '@cms/settings-contract';
import {
  setupDescriptionCollectionEndpoint,
  setupDescriptionDetailEndpoint,
} from './setup-description.endpoints';
import {
  applySetupDescriptionDetailToCache,
  invalidateSetupDescriptionListsForType,
} from './setup-description.cache';

async function parseSetupDescriptionDetail(
  body: unknown,
): Promise<SetupDescriptionDetailDto> {
  return setupDescriptionDetailResponseSchema.parse(body).data;
}

export const createSetupDescription = async (
  body: SetupDescriptionCreateDto,
  context?: QueryRequestContext,
): Promise<SetupDescriptionDetailDto> => {
  const response = await customFetch<unknown>(
    setupDescriptionCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSetupDescriptionDetail(response);
};

export const updateSetupDescription = async (
  id: number,
  body: SetupDescriptionUpdateDto,
  context?: QueryRequestContext,
): Promise<SetupDescriptionDetailDto> => {
  const response = await customFetch<unknown>(
    setupDescriptionDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSetupDescriptionDetail(response);
};

export const patchSetupDescription = async (
  id: number,
  body: SetupDescriptionPatchDto,
  context?: QueryRequestContext,
): Promise<SetupDescriptionDetailDto> => {
  const response = await customFetch<unknown>(
    setupDescriptionDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSetupDescriptionDetail(response);
};

const refreshSetupDescriptionScope = (
  queryClient: QueryClient,
  record: SetupDescriptionDetailDto,
) => {
  applySetupDescriptionDetailToCache(queryClient, record);
  return invalidateSetupDescriptionListsForType(
    queryClient,
    record.descriptionTypeCode,
  );
};

export const createSetupDescriptionMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: SetupDescriptionCreateDto) =>
      createSetupDescription(body),
    meta: { feature: 'setup-description', operation: 'create' },
    onSuccess: (created) => refreshSetupDescriptionScope(queryClient, created),
  });

export const updateSetupDescriptionMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: SetupDescriptionUpdateDto;
    }) => updateSetupDescription(id, body),
    meta: { feature: 'setup-description', operation: 'update' },
    onSuccess: (updated) => refreshSetupDescriptionScope(queryClient, updated),
  });

export const patchSetupDescriptionMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: SetupDescriptionPatchDto;
    }) => patchSetupDescription(id, body),
    meta: { feature: 'setup-description', operation: 'patch' },
    onSuccess: (updated) => refreshSetupDescriptionScope(queryClient, updated),
  });
