import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  salesActivityOutcomeDetailResponseSchema,
  type SalesActivityOutcomeCreateDto,
  type SalesActivityOutcomeDetailDto,
  type SalesActivityOutcomePatchDto,
  type SalesActivityOutcomeUpdateDto,
} from '@cms/settings-contract';
import {
  salesActivityOutcomeCollectionEndpoint,
  salesActivityOutcomeDetailEndpoint,
} from './sales-activity-outcome.endpoints';
import { salesActivityOutcomeKeys } from './sales-activity-outcome.keys';

async function parseSalesActivityOutcomeDetail(
  body: unknown,
): Promise<SalesActivityOutcomeDetailDto> {
  return salesActivityOutcomeDetailResponseSchema.parse(body).data;
}

export const createSalesActivityOutcome = async (
  body: SalesActivityOutcomeCreateDto,
  context?: QueryRequestContext,
): Promise<SalesActivityOutcomeDetailDto> => {
  const response = await customFetch<unknown>(
    salesActivityOutcomeCollectionEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSalesActivityOutcomeDetail(response);
};

export const updateSalesActivityOutcome = async (
  id: number,
  body: SalesActivityOutcomeUpdateDto,
  context?: QueryRequestContext,
): Promise<SalesActivityOutcomeDetailDto> => {
  const response = await customFetch<unknown>(
    salesActivityOutcomeDetailEndpoint(id),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSalesActivityOutcomeDetail(response);
};

export const patchSalesActivityOutcome = async (
  id: number,
  body: SalesActivityOutcomePatchDto,
  context?: QueryRequestContext,
): Promise<SalesActivityOutcomeDetailDto> => {
  const response = await customFetch<unknown>(
    salesActivityOutcomeDetailEndpoint(id),
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return parseSalesActivityOutcomeDetail(response);
};

function invalidateSalesActivityOutcomes(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: salesActivityOutcomeKeys.all,
  });
}

export const createSalesActivityOutcomeMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: SalesActivityOutcomeCreateDto) =>
      createSalesActivityOutcome(body),
    meta: { feature: 'sales-activity-outcome', operation: 'create' },
    onSuccess: () => invalidateSalesActivityOutcomes(queryClient),
  });

export const updateSalesActivityOutcomeMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: SalesActivityOutcomeUpdateDto;
    }) => updateSalesActivityOutcome(id, body),
    meta: { feature: 'sales-activity-outcome', operation: 'update' },
    onSuccess: () => invalidateSalesActivityOutcomes(queryClient),
  });

export const patchSalesActivityOutcomeMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: SalesActivityOutcomePatchDto;
    }) => patchSalesActivityOutcome(id, body),
    meta: { feature: 'sales-activity-outcome', operation: 'patch' },
    onSuccess: () => invalidateSalesActivityOutcomes(queryClient),
  });
