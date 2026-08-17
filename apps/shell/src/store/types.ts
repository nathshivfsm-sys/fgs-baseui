import type { UserDetails } from '@cms/platform-contract';
import type { Theme } from '../lib/theme';

export interface ShellState {
  tenantId: string;
  currentUser: UserDetails;
  theme: Theme;
  setTenantId: (tenantId: string) => void;
  toggleTheme: () => void;
}
