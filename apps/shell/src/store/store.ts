import { createStore } from 'zustand/vanilla';
import { applyTheme, getStoredTheme } from '../lib/theme';
import { DEFAULT_TENANT_ID, MOCK_CURRENT_USER } from './constants';
import type { ShellState } from './types';

// Applied here (not just in index.html's inline script) so the class stays in
// sync even if the store is imported somewhere that inline script never runs
// (e.g. Storybook, tests).
const initialTheme = getStoredTheme();
applyTheme(initialTheme);

// Global client state is owned by the shell and shared as runtime snapshots.
export const shellStore = createStore<ShellState>()((set, get) => ({
  tenantId: DEFAULT_TENANT_ID,
  currentUser: MOCK_CURRENT_USER,
  theme: initialTheme,
  setTenantId: (tenantId) => set({ tenantId }),
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    set({ theme: nextTheme });
  },
}));
