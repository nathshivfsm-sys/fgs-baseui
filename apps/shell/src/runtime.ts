import { createCmsQueryClient, type CmsRuntime } from '@cms/platform-contract';

export const cmsRuntime = {
  queryClient: createCmsQueryClient(),
} satisfies Pick<CmsRuntime, 'queryClient'>;
