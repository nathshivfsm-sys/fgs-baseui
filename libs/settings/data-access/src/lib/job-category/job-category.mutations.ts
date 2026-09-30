import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  jobCategoryDetailResponseSchema,
  type JobCategoryCreateDto,
  type JobCategoryDetailDto,
  type JobCategoryPatchDto,
  type JobCategoryUpdateDto,
} from '@cms/settings-contract';
import {
  jobCategoryCollectionEndpoint,
  jobCategoryDetailEndpoint,
} from './job-category.endpoints';
import { jobCategoryKeys } from './job-category.keys';

async function parseJobCategoryDetail(
  body: unknown,
): Promise<JobCategoryDetailDto> {
  return jobCategoryDetailResponseSchema.parse(body).data;
}

export const createJobCategory = async (
  body: JobCategoryCreateDto,
  context?: QueryRequestContext,
): Promise<JobCategoryDetailDto> => {
  const response = await customFetch<unknown>(jobCategoryCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseJobCategoryDetail(response);
};

export const updateJobCategory = async (
  id: number,
  body: JobCategoryUpdateDto,
  context?: QueryRequestContext,
): Promise<JobCategoryDetailDto> => {
  const response = await customFetch<unknown>(jobCategoryDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseJobCategoryDetail(response);
};

export const patchJobCategory = async (
  id: number,
  body: JobCategoryPatchDto,
  context?: QueryRequestContext,
): Promise<JobCategoryDetailDto> => {
  const response = await customFetch<unknown>(jobCategoryDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseJobCategoryDetail(response);
};

function invalidateJobCategories(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: jobCategoryKeys.all });
}

export const createJobCategoryMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: JobCategoryCreateDto) => createJobCategory(body),
    meta: { feature: 'job-category', operation: 'create' },
    onSuccess: () => invalidateJobCategories(queryClient),
  });

export const updateJobCategoryMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: JobCategoryUpdateDto }) =>
      updateJobCategory(id, body),
    meta: { feature: 'job-category', operation: 'update' },
    onSuccess: () => invalidateJobCategories(queryClient),
  });

export const patchJobCategoryMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: JobCategoryPatchDto }) =>
      patchJobCategory(id, body),
    meta: { feature: 'job-category', operation: 'patch' },
    onSuccess: () => invalidateJobCategories(queryClient),
  });
