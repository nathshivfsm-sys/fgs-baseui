import {
  createCmsQueryClient,
  logCmsQueryError,
  type CmsRuntime,
} from '@cms/platform-contract';
import { configureCustomFetch } from '@cms/shared-api';

// No real backend exists yet — baseUrl is empty until one is wired up (see
// libs/shared/api/README.md). VITE_API_URL is read here, not inside customFetch
// itself, so the library stays bundler-agnostic.
configureCustomFetch({
  baseUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? '',
});

export const cmsRuntime = {
  queryClient: createCmsQueryClient({ onError: logCmsQueryError }),
} satisfies Pick<CmsRuntime, 'queryClient'>;
