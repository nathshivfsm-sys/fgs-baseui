import {
  createCmsQueryClient,
  logCmsQueryError,
  type CmsRuntime,
  type UserDetails,
} from '@cms/platform-contract';
import { configureCustomFetch } from '@cms/shared-api';
import { getSessionToken } from '@cms/shared-auth';

configureCustomFetch({
  baseUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? '',
  getAuthToken: getSessionToken,
});

const standaloneUser = {
  id: 'standalone-user',
  displayName: 'Standalone User',
  email: 'standalone.user@example.com',
  role: 'Developer',
} satisfies UserDetails;

export const standaloneRuntime: CmsRuntime = {
  tenantId: 'standalone',
  currentUser: standaloneUser,
  queryClient: createCmsQueryClient({ onError: logCmsQueryError }),
};
