import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  techSkillLevelDetailResponseSchema,
  techSkillLevelListResponseSchema,
  techSkillLevelLookupResponseSchema,
  type PagedResult,
  type TechSkillLevelDetailDto,
  type TechSkillLevelListParams,
  type TechSkillLevelLookupDto,
  type TechSkillLevelSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  techSkillLevelDetailEndpoint,
  techSkillLevelListEndpoint,
  techSkillLevelLookupEndpoint,
} from './tech-skill-level.endpoints';
import { techSkillLevelKeys } from './tech-skill-level.keys';

export const loadTechSkillLevels = async (
  params: TechSkillLevelListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<TechSkillLevelSummaryDto>> => {
  const body = await customFetch<unknown>(techSkillLevelListEndpoint(params), {
    signal,
  });
  return toPagedResult(techSkillLevelListResponseSchema.parse(body).data);
};

export const loadTechSkillLevel = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<TechSkillLevelDetailDto> => {
  const body = await customFetch<unknown>(techSkillLevelDetailEndpoint(id), {
    signal,
  });
  return techSkillLevelDetailResponseSchema.parse(body).data;
};

export const loadTechSkillLevelLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly TechSkillLevelLookupDto[]> => {
  const body = await customFetch<unknown>(
    techSkillLevelLookupEndpoint(activeOnly),
    { signal },
  );
  return techSkillLevelLookupResponseSchema.parse(body).data;
};

export const techSkillLevelListQueryOptions = (
  params: TechSkillLevelListParams = {},
) =>
  queryOptions({
    queryKey: techSkillLevelKeys.list(params),
    queryFn: ({ signal }) => loadTechSkillLevels(params, { signal }),
    meta: { feature: 'tech-skill-level', operation: 'list' },
  });

export const techSkillLevelDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: techSkillLevelKeys.detail(id),
    queryFn: ({ signal }) => loadTechSkillLevel(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tech-skill-level', operation: 'detail' },
  });

export const techSkillLevelLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: techSkillLevelKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadTechSkillLevelLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'tech-skill-level', operation: 'lookup' },
  });
