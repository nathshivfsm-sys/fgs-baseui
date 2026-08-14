import type { UserDetails } from '@cms/platform-contract';

export interface ShellState {
  tenantId: string;
  currentUser: UserDetails;
  setTenantId: (tenantId: string) => void;
}
