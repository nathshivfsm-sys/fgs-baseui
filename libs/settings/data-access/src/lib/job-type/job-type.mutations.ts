import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  jobTypeDetailResponseSchema,
  type JobTypeCreateDto,
  type JobTypeDetailDto,
  type JobTypePatchDto,
  type JobTypeUpdateDto,
} from '@cms/settings-contract';
import {
  jobTypeCollectionEndpoint,
  jobTypeDetailEndpoint,
} from './job-type.endpoints';
import { jobTypeKeys } from './job-type.keys';

async function parseJobTypeDetail(body: unknown): Promise<JobTypeDetailDto> {
  return jobTypeDetailResponseSchema.parse(body).data;
}

export const createJobType = async (
  body: JobTypeCreateDto,
  context?: QueryRequestContext,
): Promise<JobTypeDetailDto> => {
  const response = await customFetch<unknown>(jobTypeCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseJobTypeDetail(response);
};

export const updateJobType = async (
  id: number,
  body: JobTypeUpdateDto,
  context?: QueryRequestContext,
): Promise<JobTypeDetailDto> => {
  const response = await customFetch<unknown>(jobTypeDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseJobTypeDetail(response);
};

export const patchJobType = async (
  id: number,
  body: JobTypePatchDto,
  context?: QueryRequestContext,
): Promise<JobTypeDetailDto> => {
  const response = await customFetch<unknown>(jobTypeDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseJobTypeDetail(response);
};

function invalidateJobTypes(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: jobTypeKeys.all });
}

export const createJobTypeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: JobTypeCreateDto) => createJobType(body),
    meta: { feature: 'job-type', operation: 'create' },
    onSuccess: () => invalidateJobTypes(queryClient),
  });

export const updateJobTypeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: JobTypeUpdateDto }) =>
      updateJobType(id, body),
    meta: { feature: 'job-type', operation: 'update' },
    onSuccess: () => invalidateJobTypes(queryClient),
  });

export const patchJobTypeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: JobTypePatchDto }) =>
      patchJobType(id, body),
    meta: { feature: 'job-type', operation: 'patch' },
    onSuccess: () => invalidateJobTypes(queryClient),
  });
