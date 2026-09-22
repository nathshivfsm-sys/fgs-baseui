import { Avatar, AvatarFallback } from '@cms/ui';
import { getUserInitials, userAvatarClassNames } from '../util';

export interface UserListAvatarProps {
  displayName: string | null | undefined;
  userId: string;
}

export const UserListAvatar = ({ displayName, userId }: UserListAvatarProps) => {
  const { foreground, surface } = userAvatarClassNames(userId);

  return (
    <Avatar className="after:hidden" size="default">
      <AvatarFallback
        className={`font-semibold ${surface} ${foreground} text-caption`}
      >
        {getUserInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );
};
