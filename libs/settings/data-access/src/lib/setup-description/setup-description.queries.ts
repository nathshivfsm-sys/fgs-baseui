import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  setupDescriptionDetailResponseSchema,
  setupDescriptionListResponseSchema,
  setupDescriptionLookupResponseSchema,
  type PagedResult,
  type SetupDescriptionDetailDto,
  type SetupDescriptionListParams,
  type SetupDescriptionLookupDto,
  type SetupDescriptionLookupParams,
  type SetupDescriptionSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  setupDescriptionDetailEndpoint,
  setupDescriptionListEndpoint,
  setupDescriptionLookupEndpoint,
} from './setup-description.endpoints';
import { setupDescriptionKeys } from './setup-description.keys';

export const loadSetupDescriptions = async (
  params: SetupDescriptionListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<SetupDescriptionSummaryDto>> => {
  const body = await customFetch<unknown>(
    setupDescriptionListEndpoint(params),
    {
      signal,
    },
  );
  return toPagedResult(setupDescriptionListResponseSchema.parse(body).data);
};

export const loadSetupDescription = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<SetupDescriptionDetailDto> => {
  const body = await customFetch<unknown>(setupDescriptionDetailEndpoint(id), {
    signal,
  });
  return setupDescriptionDetailResponseSchema.parse(body).data;
};

export const loadSetupDescriptionLookup = async (
  params: SetupDescriptionLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly SetupDescriptionLookupDto[]> => {
  const body = await customFetch<unknown>(
    setupDescriptionLookupEndpoint(params),
    { signal },
  );
  return setupDescriptionLookupResponseSchema.parse(body).data;
};

export const setupDescriptionListQueryOptions = (
  params: SetupDescriptionListParams = {},
) =>
  queryOptions({
    queryKey: setupDescriptionKeys.list(params),
    queryFn: ({ signal }) => loadSetupDescriptions(params, { signal }),
    meta: { feature: 'setup-description', operation: 'list' },
  });

export const setupDescriptionDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: setupDescriptionKeys.detail(id),
    queryFn: ({ signal }) => loadSetupDescription(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'setup-description', operation: 'detail' },
  });

export const setupDescriptionLookupQueryOptions = (
  params: SetupDescriptionLookupParams = {},
) =>
  queryOptions({
    queryKey: setupDescriptionKeys.lookup(params),
    queryFn: ({ signal }) => loadSetupDescriptionLookup(params, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'setup-description', operation: 'lookup' },
  });
