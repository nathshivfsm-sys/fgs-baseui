import { createStore } from 'zustand/vanilla';
import {
  createCmsQueryClient,
  type AppState,
  type CmsRuntime,
} from '@cms/platform-contract';

const appStore = createStore<AppState>()((set) => ({
  tenantId: 'northwind',
  sidebarOpen: true,
  setTenantId: (tenantId) => set({ tenantId }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

const queryClient = createCmsQueryClient();

export const cmsRuntime: CmsRuntime = { appStore, queryClient };
