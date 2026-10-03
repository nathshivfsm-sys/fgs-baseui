import type {
  ResolutionCodeListParams,
  ResolutionCodeLookupParams,
} from '@cms/settings-contract';

export const resolutionCodeKeys = {
  all: ['resolution-code'] as const,
  lists: () => [...resolutionCodeKeys.all, 'list'] as const,
  list: (params: ResolutionCodeListParams = {}) =>
    [...resolutionCodeKeys.lists(), params] as const,
  details: () => [...resolutionCodeKeys.all, 'detail'] as const,
  detail: (id: number) => [...resolutionCodeKeys.details(), id] as const,
  lookups: () => [...resolutionCodeKeys.all, 'lookup'] as const,
  lookup: (params: ResolutionCodeLookupParams = {}) =>
    [...resolutionCodeKeys.lookups(), params] as const,
} as const;
