import { cn } from '@cms/ui';
import type { EmployeeRoleBadgeProps } from '../types';
import { formatRoleLabel, roleBadgeClassName } from '../util';

export const EmployeeRoleBadge = ({ roleName }: EmployeeRoleBadgeProps) => {
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
