import { Avatar, AvatarFallback, BodySmall } from '@cms/ui';
import type { UserSummaryDto } from '@cms/user-contract';
import { NO_USERS_FOR_ROLE } from '../constant';
import type { RoleUsersTabProps } from '../types';

const userInitials = (displayName: string | null | undefined) => {
  const parts = (displayName ?? '')
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  const first = parts[0]?.charAt(0) ?? '';
  const second =
    parts.length > 1
      ? (parts[1]?.charAt(0) ?? '')
      : (parts[0]?.charAt(1) ?? '');
  const initials = `${first}${second}`.toUpperCase();
  return initials || '?';
};

const RoleUserRow = ({
  roleName,
  user,
}: {
  roleName: string;
  user: UserSummaryDto;
}) => (
  <div className="flex items-center justify-between border-b border-border-subtle/60 py-3">
    <div className="flex items-center gap-3">
      <Avatar className="after:hidden" size="default">
        <AvatarFallback className="bg-surface-sunken text-caption font-semibold text-foreground">
          {userInitials(user.displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-body-sm font-medium text-foreground">
          {user.displayName ?? 'Unknown'}
        </span>
        <BodySmall color="foreground-subtle">{user.email ?? '—'}</BodySmall>
      </div>
    </div>
    <BodySmall color="foreground-subtle">{roleName}</BodySmall>
  </div>
);

export const RoleUsersTab = ({
  loading,
  roleName,
  users,
}: RoleUsersTabProps) => {
  if (loading) {
    return (
      <BodySmall className="px-6 py-4" color="foreground-subtle">
        Loading users…
      </BodySmall>
    );
  }

  if (users.length === 0) {
    return (
      <BodySmall className="px-6 py-4" color="foreground-subtle">
        {NO_USERS_FOR_ROLE}
      </BodySmall>
    );
  }

  return (
    <div className="px-6 py-2">
      {users.map((user) => (
        <RoleUserRow key={user.id} roleName={roleName} user={user} />
      ))}
    </div>
  );
};
