import type { TechSkillLevelListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const techSkillLevelCollectionEndpoint = '/techskilllevel';

export function techSkillLevelListEndpoint(
  params: TechSkillLevelListParams = {},
): string {
  return `${techSkillLevelCollectionEndpoint}${toSearchParams(params)}`;
}

export function techSkillLevelDetailEndpoint(id: number): string {
  return `${techSkillLevelCollectionEndpoint}/${id}`;
}

export function techSkillLevelLookupEndpoint(activeOnly = true): string {
  return `${techSkillLevelCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
