import type {
  SetupDescriptionListParams,
  SetupDescriptionLookupParams,
} from '@cms/settings-contract';

export const setupDescriptionKeys = {
  all: ['setup-description'] as const,
  lists: () => [...setupDescriptionKeys.all, 'list'] as const,
  list: (params: SetupDescriptionListParams = {}) =>
    [...setupDescriptionKeys.lists(), params] as const,
  details: () => [...setupDescriptionKeys.all, 'detail'] as const,
  detail: (id: number) => [...setupDescriptionKeys.details(), id] as const,
  lookups: () => [...setupDescriptionKeys.all, 'lookup'] as const,
  lookup: (params: SetupDescriptionLookupParams = {}) =>
    [...setupDescriptionKeys.lookups(), params] as const,
} as const;
