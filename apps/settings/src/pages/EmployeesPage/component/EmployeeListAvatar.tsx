import { Avatar, AvatarFallback } from '@cms/ui';
import type { EmployeeListAvatarProps } from '../types';
import { employeeAvatarClassNames, getEmployeeInitials } from '../util';

export const EmployeeListAvatar = ({
  displayName,
  employeeId,
}: EmployeeListAvatarProps) => {
  const { foreground, surface } = employeeAvatarClassNames(String(employeeId));

  return (
    <Avatar className="after:hidden" size="default">
      <AvatarFallback
        className={`font-semibold ${surface} ${foreground} text-caption`}
      >
        {getEmployeeInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );
};
