import type { QueryClient } from '@tanstack/react-query';

export interface UserDetails {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly role: string;
  /** Optional so existing hosts keep compiling; consumers fall back to initials. */
  readonly avatarUrl?: string;
}

/** Values and services that the shell explicitly provides to an MFE. */
export interface CmsRuntime {
  tenantId: string;
  currentUser: UserDetails;
  queryClient: QueryClient;
}
