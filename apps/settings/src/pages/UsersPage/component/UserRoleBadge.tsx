import { cn } from '@cms/ui';
import { formatRoleLabel, roleBadgeClassName } from '../util';

export interface UserRoleBadgeProps {
  roleName: string | null | undefined;
}

export const UserRoleBadge = ({ roleName }: UserRoleBadgeProps) => {
  if (!roleName?.trim()) {
    return <>—</>;
  }

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded px-2 py-0.5 text-caption font-semibold leading-4',
        roleBadgeClassName(roleName),
      )}
    >
      {formatRoleLabel(roleName)}
    </span>
  );
};
