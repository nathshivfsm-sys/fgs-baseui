import type { UserDetails } from '@cms/platform-contract';

/** Until permission claims ship on `UserDetails`, treat read-only roles as view-only. */
export const canEditCustomer = (user: UserDetails): boolean => {
  const role = user.role.toLowerCase();
  return !role.includes('read') && !role.includes('view');
};
