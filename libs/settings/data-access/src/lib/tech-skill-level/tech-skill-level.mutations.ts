import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  techSkillLevelDetailResponseSchema,
  type TechSkillLevelCreateDto,
  type TechSkillLevelDetailDto,
  type TechSkillLevelPatchDto,
  type TechSkillLevelUpdateDto,
} from '@cms/settings-contract';
import {
  techSkillLevelCollectionEndpoint,
  techSkillLevelDetailEndpoint,
} from './tech-skill-level.endpoints';
import { techSkillLevelKeys } from './tech-skill-level.keys';

async function parseTechSkillLevelDetail(
  body: unknown,
): Promise<TechSkillLevelDetailDto> {
  return techSkillLevelDetailResponseSchema.parse(body).data;
}

export const createTechSkillLevel = async (
  body: TechSkillLevelCreateDto,
  context?: QueryRequestContext,
): Promise<TechSkillLevelDetailDto> => {
  const response = await customFetch<unknown>(
    techSkillLevelCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseTechSkillLevelDetail(response);
};

export const updateTechSkillLevel = async (
  id: number,
  body: TechSkillLevelUpdateDto,
  context?: QueryRequestContext,
): Promise<TechSkillLevelDetailDto> => {
  const response = await customFetch<unknown>(
    techSkillLevelDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseTechSkillLevelDetail(response);
};

export const deleteTechSkillLevel = async (
  id: number,
  context?: QueryRequestContext,
): Promise<void> => {
  await customFetch<unknown>(techSkillLevelDetailEndpoint(id), {
    method: 'DELETE',
    signal: context?.signal,
  });
};

export const patchTechSkillLevel = async (
  id: number,
  body: TechSkillLevelPatchDto,
  context?: QueryRequestContext,
): Promise<TechSkillLevelDetailDto> => {
  const response = await customFetch<unknown>(
    techSkillLevelDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseTechSkillLevelDetail(response);
};

function invalidateTechSkillLevels(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: techSkillLevelKeys.all });
}

export const createTechSkillLevelMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: TechSkillLevelCreateDto) => createTechSkillLevel(body),
    meta: { feature: 'tech-skill-level', operation: 'create' },
    onSuccess: () => invalidateTechSkillLevels(queryClient),
  });

export const updateTechSkillLevelMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: TechSkillLevelUpdateDto;
    }) => updateTechSkillLevel(id, body),
    meta: { feature: 'tech-skill-level', operation: 'update' },
    onSuccess: () => invalidateTechSkillLevels(queryClient),
  });

export const patchTechSkillLevelMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: TechSkillLevelPatchDto }) =>
      patchTechSkillLevel(id, body),
    meta: { feature: 'tech-skill-level', operation: 'patch' },
    onSuccess: () => invalidateTechSkillLevels(queryClient),
  });

export const deleteTechSkillLevelMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (id: number) => deleteTechSkillLevel(id),
    meta: { feature: 'tech-skill-level', operation: 'delete' },
    onSuccess: () => invalidateTechSkillLevels(queryClient),
  });
