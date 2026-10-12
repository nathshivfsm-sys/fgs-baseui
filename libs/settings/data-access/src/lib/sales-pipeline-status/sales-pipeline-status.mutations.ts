import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  salesPipelineStatusDetailResponseSchema,
  type SalesPipelineStatusCreateDto,
  type SalesPipelineStatusDetailDto,
  type SalesPipelineStatusPatchDto,
  type SalesPipelineStatusUpdateDto,
} from '@cms/settings-contract';
import {
  salesPipelineStatusCollectionEndpoint,
  salesPipelineStatusDetailEndpoint,
} from './sales-pipeline-status.endpoints';
import { salesPipelineStatusKeys } from './sales-pipeline-status.keys';

async function parseSalesPipelineStatusDetail(
  body: unknown,
): Promise<SalesPipelineStatusDetailDto> {
  return salesPipelineStatusDetailResponseSchema.parse(body).data;
}

export const createSalesPipelineStatus = async (
  body: SalesPipelineStatusCreateDto,
  context?: QueryRequestContext,
): Promise<SalesPipelineStatusDetailDto> => {
  const response = await customFetch<unknown>(
    salesPipelineStatusCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSalesPipelineStatusDetail(response);
};

export const updateSalesPipelineStatus = async (
  id: number,
  body: SalesPipelineStatusUpdateDto,
  context?: QueryRequestContext,
): Promise<SalesPipelineStatusDetailDto> => {
  const response = await customFetch<unknown>(
    salesPipelineStatusDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSalesPipelineStatusDetail(response);
};

export const patchSalesPipelineStatus = async (
  id: number,
  body: SalesPipelineStatusPatchDto,
  context?: QueryRequestContext,
): Promise<SalesPipelineStatusDetailDto> => {
  const response = await customFetch<unknown>(
    salesPipelineStatusDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSalesPipelineStatusDetail(response);
};

function invalidateSalesPipelineStatuses(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: salesPipelineStatusKeys.all,
  });
}

export const createSalesPipelineStatusMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: SalesPipelineStatusCreateDto) =>
      createSalesPipelineStatus(body),
    meta: { feature: 'sales-pipeline-status', operation: 'create' },
    onSuccess: () => invalidateSalesPipelineStatuses(queryClient),
  });

export const updateSalesPipelineStatusMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: SalesPipelineStatusUpdateDto;
    }) => updateSalesPipelineStatus(id, body),
    meta: { feature: 'sales-pipeline-status', operation: 'update' },
    onSuccess: () => invalidateSalesPipelineStatuses(queryClient),
  });

export const patchSalesPipelineStatusMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: SalesPipelineStatusPatchDto;
    }) => patchSalesPipelineStatus(id, body),
    meta: { feature: 'sales-pipeline-status', operation: 'patch' },
    onSuccess: () => invalidateSalesPipelineStatuses(queryClient),
  });
