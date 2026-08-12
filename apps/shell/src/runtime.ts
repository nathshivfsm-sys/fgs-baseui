import { QueryClient } from '@tanstack/react-query';
import { createStore } from 'zustand/vanilla';
import type { AppState, CmsRuntime } from '@cms/platform-contract';

const appStore = createStore<AppState>()((set) => ({
  tenantId: 'northwind',
  sidebarOpen: true,
  setTenantId: (tenantId) => set({ tenantId }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

export const cmsRuntime: CmsRuntime = { appStore, queryClient };
