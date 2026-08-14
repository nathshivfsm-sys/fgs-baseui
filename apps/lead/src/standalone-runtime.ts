import {
  createCmsQueryClient,
  type CmsRuntime,
  type UserDetails,
} from '@cms/platform-contract';

const standaloneUser = {
  id: 'standalone-user',
  displayName: 'Standalone User',
  email: 'standalone.user@example.com',
  role: 'Developer',
} satisfies UserDetails;

export const standaloneRuntime: CmsRuntime = {
  tenantId: 'standalone',
  currentUser: standaloneUser,
  queryClient: createCmsQueryClient(),
};
