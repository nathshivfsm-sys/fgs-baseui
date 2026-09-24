import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  businessTypeDetailResponseSchema,
  type BusinessTypeCreateDto,
  type BusinessTypeDetailDto,
  type BusinessTypePatchDto,
  type BusinessTypeUpdateDto,
} from '@cms/settings-contract';
import {
  businessTypeCollectionEndpoint,
  businessTypeDetailEndpoint,
} from './business-type.endpoints';
import { businessTypeKeys } from './business-type.keys';

async function parseBusinessTypeDetail(
  body: unknown,
): Promise<BusinessTypeDetailDto> {
  return businessTypeDetailResponseSchema.parse(body).data;
}

export const createBusinessType = async (
  body: BusinessTypeCreateDto,
  context?: QueryRequestContext,
): Promise<BusinessTypeDetailDto> => {
  const response = await customFetch<unknown>(businessTypeCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseBusinessTypeDetail(response);
};

export const updateBusinessType = async (
  id: number,
  body: BusinessTypeUpdateDto,
  context?: QueryRequestContext,
): Promise<BusinessTypeDetailDto> => {
  const response = await customFetch<unknown>(businessTypeDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseBusinessTypeDetail(response);
};

export const patchBusinessType = async (
  id: number,
  body: BusinessTypePatchDto,
  context?: QueryRequestContext,
): Promise<BusinessTypeDetailDto> => {
  const response = await customFetch<unknown>(businessTypeDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseBusinessTypeDetail(response);
};

function invalidateBusinessTypes(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: businessTypeKeys.all });
}

export const createBusinessTypeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: BusinessTypeCreateDto) => createBusinessType(body),
    meta: { feature: 'business-type', operation: 'create' },
    onSuccess: () => invalidateBusinessTypes(queryClient),
  });

export const updateBusinessTypeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: BusinessTypeUpdateDto;
    }) => updateBusinessType(id, body),
    meta: { feature: 'business-type', operation: 'update' },
    onSuccess: () => invalidateBusinessTypes(queryClient),
  });

export const patchBusinessTypeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: BusinessTypePatchDto }) =>
      patchBusinessType(id, body),
    meta: { feature: 'business-type', operation: 'patch' },
    onSuccess: () => invalidateBusinessTypes(queryClient),
  });
