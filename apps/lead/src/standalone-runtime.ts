import { createStore } from 'zustand/vanilla';
import {
  createCmsQueryClient,
  type AppState,
  type CmsRuntime,
} from '@cms/platform-contract';

const appStore = createStore<AppState>()((set) => ({
  tenantId: 'standalone',
  sidebarOpen: true,
  setTenantId: (tenantId) => set({ tenantId }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export const standaloneRuntime: CmsRuntime = {
  appStore,
  queryClient: createCmsQueryClient(),
};
