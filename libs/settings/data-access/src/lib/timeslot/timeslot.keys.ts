import type {
  TimeslotListParams,
  TimeslotLookupParams,
} from '@cms/settings-contract';

export const timeslotKeys = {
  all: ['timeslot'] as const,
  lists: () => [...timeslotKeys.all, 'list'] as const,
  list: (params: TimeslotListParams = {}) =>
    [...timeslotKeys.lists(), params] as const,
  details: () => [...timeslotKeys.all, 'detail'] as const,
  detail: (id: number) => [...timeslotKeys.details(), id] as const,
  lookups: () => [...timeslotKeys.all, 'lookup'] as const,
  lookup: (params: TimeslotLookupParams = {}) =>
    [...timeslotKeys.lookups(), params] as const,
} as const;
