import type { QueryClient } from '@tanstack/react-query';
import type {
  SetupDescriptionDetailDto,
  SetupDescriptionListParams,
} from '@cms/settings-contract';
import { setupDescriptionKeys } from './setup-description.keys';

const listParamsFromQueryKey = (
  queryKey: readonly unknown[],
): SetupDescriptionListParams | undefined => {
  if (queryKey[0] !== setupDescriptionKeys.all[0]) return undefined;
  if (queryKey[1] !== 'list') return undefined;
  const params = queryKey[2];
  return params && typeof params === 'object'
    ? (params as SetupDescriptionListParams)
    : undefined;
};

/** Refetch list queries (table, tab counts) for one description type only. */
export const invalidateSetupDescriptionListsForType = (
  queryClient: QueryClient,
  descriptionTypeCode: string | null | undefined,
) => {
  if (!descriptionTypeCode) {
    return queryClient.invalidateQueries({
      queryKey: setupDescriptionKeys.lists(),
    });
  }

  return queryClient.invalidateQueries({
    predicate: (query) => {
      const params = listParamsFromQueryKey(query.queryKey);
      if (!params) return false;
      return params.descriptionTypeCode === descriptionTypeCode;
    },
  });
};

export const applySetupDescriptionDetailToCache = (
  queryClient: QueryClient,
  record: SetupDescriptionDetailDto,
) => {
  queryClient.setQueryData(setupDescriptionKeys.detail(record.id), record);
};
