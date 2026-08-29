import type { Theme } from '../lib/theme';

export interface ShellState {
  tenantId: string;
  theme: Theme;
  setTenantId: (tenantId: string) => void;
  toggleTheme: () => void;
}
