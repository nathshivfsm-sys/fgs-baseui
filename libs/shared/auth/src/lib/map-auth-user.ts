import type { AuthUserDto } from '@cms/auth-data-access';
import type { UserDetails } from '@cms/platform-contract';

/** `TENANT_ADMIN` -> `Tenant Admin`. The API returns roles as SCREAMING_SNAKE_CASE. */
const formatRole = (role: string | undefined): string => {
  if (!role) return 'User';
  return role
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const mapAuthUserDtoToUserDetails = (user: AuthUserDto): UserDetails => {
  const displayName = `${user.firstName} ${user.lastName}`.trim();
  return {
    id: user.userId,
    displayName: displayName || user.email,
    email: user.email,
    role: formatRole(user.roles[0]),
    ...(user.companyId ? { companyId: user.companyId } : {}),
  };
};
