import type { QueryClient } from '@tanstack/react-query';

export interface UserDetails {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly role: string;
}

/** Values and services that the shell explicitly provides to an MFE. */
export interface CmsRuntime {
  tenantId: string;
  currentUser: UserDetails;
  queryClient: QueryClient;
}
