import type { QueryClient } from '@tanstack/react-query';
import type { StoreApi } from 'zustand/vanilla';

export interface AppState {
  tenantId: string;
  sidebarOpen: boolean;
  setTenantId: (tenantId: string) => void;
  toggleSidebar: () => void;
}

export interface CmsRuntime {
  appStore: StoreApi<AppState>;
  queryClient: QueryClient;
}
