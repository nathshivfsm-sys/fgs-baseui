import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  postalCodeDetailResponseSchema,
  type PostalCodeCreateDto,
  type PostalCodeDetailDto,
  type PostalCodePatchDto,
  type PostalCodeUpdateDto,
} from '@cms/settings-contract';
import {
  postalCodeCollectionEndpoint,
  postalCodeDetailEndpoint,
} from './postal-code.endpoints';
import { postalCodeKeys } from './postal-code.keys';

async function parsePostalCodeDetail(
  body: unknown,
): Promise<PostalCodeDetailDto> {
  return postalCodeDetailResponseSchema.parse(body).data;
}

export const createPostalCode = async (
  body: PostalCodeCreateDto,
  context?: QueryRequestContext,
): Promise<PostalCodeDetailDto> => {
  const response = await customFetch<unknown>(postalCodeCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePostalCodeDetail(response);
};

export const updatePostalCode = async (
  id: number,
  body: PostalCodeUpdateDto,
  context?: QueryRequestContext,
): Promise<PostalCodeDetailDto> => {
  const response = await customFetch<unknown>(postalCodeDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePostalCodeDetail(response);
};

export const patchPostalCode = async (
  id: number,
  body: PostalCodePatchDto,
  context?: QueryRequestContext,
): Promise<PostalCodeDetailDto> => {
  const response = await customFetch<unknown>(postalCodeDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePostalCodeDetail(response);
};

function invalidatePostalCodes(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: postalCodeKeys.all });
}

export const createPostalCodeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: PostalCodeCreateDto) => createPostalCode(body),
    meta: { feature: 'postalcode', operation: 'create' },
    onSuccess: () => invalidatePostalCodes(queryClient),
  });

export const updatePostalCodeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PostalCodeUpdateDto }) =>
      updatePostalCode(id, body),
    meta: { feature: 'postalcode', operation: 'update' },
    onSuccess: () => invalidatePostalCodes(queryClient),
  });

export const patchPostalCodeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PostalCodePatchDto }) =>
      patchPostalCode(id, body),
    meta: { feature: 'postalcode', operation: 'patch' },
    onSuccess: () => invalidatePostalCodes(queryClient),
  });
