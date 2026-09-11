import {
  createCmsQueryClient,
  logCmsQueryError,
  type CmsRuntime,
  type UserDetails,
} from '@cms/platform-contract';
import { configureCustomFetch } from '@cms/shared-api';

configureCustomFetch({
  baseUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? '',
});

const standaloneUser = {
  id: 'standalone-user',
  displayName: 'Standalone User',
  email: 'standalone.user@example.com',
  role: 'Developer',
  // Lets General Info render standalone. It cannot load real data here: this origin
  // has no session token and no /api/v1 proxy, so API work goes through the shell.
  companyId: 'standalone-company',
} satisfies UserDetails;

export const standaloneRuntime: CmsRuntime = {
  tenantId: 'standalone',
  currentUser: standaloneUser,
  queryClient: createCmsQueryClient({ onError: logCmsQueryError }),
};
