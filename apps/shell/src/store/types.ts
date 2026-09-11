import type { Theme } from '../util';

export interface ShellState {
  tenantId: string;
  theme: Theme;
  setTenantId: (tenantId: string) => void;
  toggleTheme: () => void;
}
