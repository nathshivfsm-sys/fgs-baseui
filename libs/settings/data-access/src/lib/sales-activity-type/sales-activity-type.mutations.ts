import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  salesActivityTypeDetailResponseSchema,
  type SalesActivityTypeCreateDto,
  type SalesActivityTypeDetailDto,
  type SalesActivityTypePatchDto,
  type SalesActivityTypeUpdateDto,
} from '@cms/settings-contract';
import {
  salesActivityTypeCollectionEndpoint,
  salesActivityTypeDetailEndpoint,
} from './sales-activity-type.endpoints';
import { salesActivityTypeKeys } from './sales-activity-type.keys';

async function parseSalesActivityTypeDetail(
  body: unknown,
): Promise<SalesActivityTypeDetailDto> {
  return salesActivityTypeDetailResponseSchema.parse(body).data;
}

export const createSalesActivityType = async (
  body: SalesActivityTypeCreateDto,
  context?: QueryRequestContext,
): Promise<SalesActivityTypeDetailDto> => {
  const response = await customFetch<unknown>(
    salesActivityTypeCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSalesActivityTypeDetail(response);
};

export const updateSalesActivityType = async (
  id: number,
  body: SalesActivityTypeUpdateDto,
  context?: QueryRequestContext,
): Promise<SalesActivityTypeDetailDto> => {
  const response = await customFetch<unknown>(
    salesActivityTypeDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSalesActivityTypeDetail(response);
};

export const patchSalesActivityType = async (
  id: number,
  body: SalesActivityTypePatchDto,
  context?: QueryRequestContext,
): Promise<SalesActivityTypeDetailDto> => {
  const response = await customFetch<unknown>(
    salesActivityTypeDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSalesActivityTypeDetail(response);
};

function invalidateSalesActivityTypes(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: salesActivityTypeKeys.all,
  });
}

export const createSalesActivityTypeMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: SalesActivityTypeCreateDto) =>
      createSalesActivityType(body),
    meta: { feature: 'sales-activity-type', operation: 'create' },
    onSuccess: () => invalidateSalesActivityTypes(queryClient),
  });

export const updateSalesActivityTypeMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: SalesActivityTypeUpdateDto;
    }) => updateSalesActivityType(id, body),
    meta: { feature: 'sales-activity-type', operation: 'update' },
    onSuccess: () => invalidateSalesActivityTypes(queryClient),
  });

export const patchSalesActivityTypeMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: SalesActivityTypePatchDto;
    }) => patchSalesActivityType(id, body),
    meta: { feature: 'sales-activity-type', operation: 'patch' },
    onSuccess: () => invalidateSalesActivityTypes(queryClient),
  });
