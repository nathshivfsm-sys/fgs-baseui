/// <reference path="./lib/query-client.augmentation.d.ts" />

export type { UserDetails, CmsRuntime } from './lib/platform-contract';

export {
  CMS_QUERY_DEFAULTS,
  createCmsQueryClient,
  disposeCmsQueryClient,
  logCmsQueryError,
} from './lib/query-client';

export type {
  CmsQueryMeta,
  CmsQueryKey,
  QueryRequestContext,
  CmsQueryErrorEvent,
  CreateCmsQueryClientOptions,
} from './lib/query-client';
