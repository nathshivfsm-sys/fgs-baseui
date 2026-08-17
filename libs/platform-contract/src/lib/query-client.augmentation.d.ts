import type { CmsQueryKey, CmsQueryMeta } from './query-client';

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: CmsQueryKey;
    mutationKey: CmsQueryKey;
    queryMeta: CmsQueryMeta;
    mutationMeta: CmsQueryMeta;
  }
}
