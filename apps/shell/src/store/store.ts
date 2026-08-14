import { createStore } from 'zustand/vanilla';
import { DEFAULT_TENANT_ID, MOCK_CURRENT_USER } from './constants';
import type { ShellState } from './types';

// Global client state is owned by the shell and shared as runtime snapshots.
export const shellStore = createStore<ShellState>()((set) => ({
  tenantId: DEFAULT_TENANT_ID,
  currentUser: MOCK_CURRENT_USER,
  setTenantId: (tenantId) => set({ tenantId }),
}));
