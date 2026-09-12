import type { ZoneListParams } from '@cms/settings-contract';

export const zoneKeys = {
  all: ['zone'] as const,
  lists: () => [...zoneKeys.all, 'list'] as const,
  list: (params: ZoneListParams = {}) =>
    [...zoneKeys.lists(), params] as const,
  details: () => [...zoneKeys.all, 'detail'] as const,
  detail: (id: number) => [...zoneKeys.details(), id] as const,
  lookups: () => [...zoneKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...zoneKeys.lookups(), { activeOnly }] as const,
} as const;
