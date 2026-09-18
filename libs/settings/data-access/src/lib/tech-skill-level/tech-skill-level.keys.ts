import type { TechSkillLevelListParams } from '@cms/settings-contract';

export const techSkillLevelKeys = {
  all: ['tech-skill-level'] as const,
  lists: () => [...techSkillLevelKeys.all, 'list'] as const,
  list: (params: TechSkillLevelListParams = {}) =>
    [...techSkillLevelKeys.lists(), params] as const,
  details: () => [...techSkillLevelKeys.all, 'detail'] as const,
  detail: (id: number) => [...techSkillLevelKeys.details(), id] as const,
  lookups: () => [...techSkillLevelKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...techSkillLevelKeys.lookups(), { activeOnly }] as const,
} as const;
