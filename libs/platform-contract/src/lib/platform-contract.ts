import type { QueryClient } from '@tanstack/react-query';

export interface UserDetails {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly role: string;
  /** Optional so existing hosts keep compiling; consumers fall back to initials. */
  readonly avatarUrl?: string;
  /**
   * Path key for company-scoped endpoints (`/company/{companyId}`), from the login
   * response. Optional so existing hosts keep compiling and so sessions stored before
   * it existed still parse; company screens treat its absence as "sign in again".
   */
  readonly companyId?: string;
}

/** Values and services that the shell explicitly provides to an MFE. */
export interface CmsRuntime {
  tenantId: string;
  currentUser: UserDetails;
  queryClient: QueryClient;
}
