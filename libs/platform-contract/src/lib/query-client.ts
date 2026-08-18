import {
  MutationCache,
  QueryCache,
  QueryClient,
  type DefaultOptions,
  type QueryKey,
} from '@tanstack/react-query';

const SECOND = 1_000;
const MINUTE = 60 * SECOND;

export const CMS_QUERY_DEFAULTS = {
  queries: {
    staleTime: 30 * SECOND,
    gcTime: 10 * MINUTE,
    retry: 1,
    retryDelay: (attempt: number) =>
      Math.min(SECOND * 2 ** attempt, 30 * SECOND),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    networkMode: 'online',
    structuralSharing: true,
    throwOnError: false,
  },
  mutations: {
    retry: 0,
    networkMode: 'online',
    throwOnError: false,
  },
} satisfies DefaultOptions;

export interface CmsQueryMeta extends Record<string, unknown> {
  feature: string;
  operation: string;
  suppressGlobalError?: boolean;
}

export type CmsQueryKey = readonly [
  scope: string,
  ...parts: readonly unknown[],
];

export interface QueryRequestContext {
  signal: AbortSignal;
}

export type CmsQueryErrorEvent =
  | {
      source: 'query';
      error: Error;
      queryKey: QueryKey;
      meta: CmsQueryMeta | undefined;
    }
  | {
      source: 'mutation';
      error: Error;
      mutationKey: QueryKey | undefined;
      meta: CmsQueryMeta | undefined;
    };

/**
 * Default telemetry sink for `createCmsQueryClient`'s `onError`. Every runtime
 * (shell, standalone workorder, standalone lead) wires this in so query/mutation
 * failures are observable instead of silently discarded. Swap for a real telemetry
 * client by passing a different `onError` to `createCmsQueryClient`.
 */
export function logCmsQueryError(event: CmsQueryErrorEvent) {
  console.error('[cms-query]', event.source, event.meta, event.error);
}

export interface CreateCmsQueryClientOptions {
  defaultOptions?: DefaultOptions;
  onError?: (event: CmsQueryErrorEvent) => void;
}

export function createCmsQueryClient({
  defaultOptions,
  onError,
}: CreateCmsQueryClientOptions = {}) {
  const queryCache = new QueryCache({
    onError: (error, query) => {
      if (!query.meta?.suppressGlobalError) {
        onError?.({
          source: 'query',
          error,
          queryKey: query.queryKey,
          meta: query.meta,
        });
      }
    },
  });
  const mutationCache = new MutationCache({
    onError: (error, _variables, _onMutateResult, mutation) => {
      if (!mutation.meta?.suppressGlobalError) {
        onError?.({
          source: 'mutation',
          error,
          mutationKey: mutation.options.mutationKey,
          meta: mutation.meta,
        });
      }
    },
  });

  return new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions: {
      ...CMS_QUERY_DEFAULTS,
      ...defaultOptions,
      queries: { ...CMS_QUERY_DEFAULTS.queries, ...defaultOptions?.queries },
      mutations: {
        ...CMS_QUERY_DEFAULTS.mutations,
        ...defaultOptions?.mutations,
      },
    },
  });
}

export function disposeCmsQueryClient(queryClient: QueryClient) {
  queryClient.clear();
}
