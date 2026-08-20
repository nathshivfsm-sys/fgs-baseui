import {
  createCmsQueryClient,
  logCmsQueryError,
  type CmsRuntime,
} from '@cms/platform-contract';
import { configureCustomFetch } from '@cms/shared-api';
import { getSessionToken } from '@cms/shared-auth';

// No real backend exists yet — baseUrl is empty until one is wired up (see
// libs/shared/api/README.md). VITE_API_URL is read here, not inside customFetch
// itself, so the library stays bundler-agnostic.
//
// getAuthToken is read per request, so every customFetch call from the host *and* from
// every federated remote carries the current session's bearer token — both libraries
// are Module Federation singletons, so this single call configures all of them.
configureCustomFetch({
  baseUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? '',
  getAuthToken: getSessionToken,
});

export const cmsRuntime = {
  queryClient: createCmsQueryClient({ onError: logCmsQueryError }),
} satisfies Pick<CmsRuntime, 'queryClient'>;
