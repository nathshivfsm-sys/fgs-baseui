import type { UserDetails } from '@cms/platform-contract';

export const DEFAULT_TENANT_ID = 'northwind';

export const TENANT_NAMES: Readonly<Record<string, string>> = Object.freeze({
  northwind: 'Northwind Facilities',
  contoso: 'Contoso Home Services',
});

/**
 * Identity handed to a remote on a public route. `CmsRuntime.currentUser` is
 * non-nullable — making it nullable for the one anonymous page would push a null check
 * into every remote — so the shell supplies an explicit guest instead. The signed-in
 * identity comes from `@cms/shared-auth`, not from this store.
 */
export const GUEST_USER = Object.freeze({
  id: 'guest',
  displayName: 'Guest',
  email: '',
  role: 'Guest',
} satisfies UserDetails);
