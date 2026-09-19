import type { GlBreakListParams } from '@cms/settings-contract';

export const glBreakKeys = {
  all: ['gl-break'] as const,
  lists: () => [...glBreakKeys.all, 'list'] as const,
  list: (params: GlBreakListParams = {}) =>
    [...glBreakKeys.lists(), params] as const,
  details: () => [...glBreakKeys.all, 'detail'] as const,
  detail: (id: number) => [...glBreakKeys.details(), id] as const,
  lookups: () => [...glBreakKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...glBreakKeys.lookups(), { activeOnly }] as const,
} as const;
