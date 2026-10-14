import { BodySmall } from '@cms/ui';
import type { EmployeeSummaryDto } from '@cms/settings-contract';
import { EmployeeListAvatar } from '../../EmployeesPage/component/EmployeeListAvatar';
import { NO_USERS_FOR_ROLE } from '../constant';
import type { RoleUsersTabProps } from '../types';

const RoleUserRow = ({
  employee,
  roleName,
}: {
  employee: EmployeeSummaryDto;
  roleName: string;
}) => (
  <div className="flex items-center justify-between border-b border-border-subtle/60 py-3">
    <div className="flex items-center gap-3">
      <EmployeeListAvatar
        displayName={employee.displayName}
        employeeId={employee.id}
      />
      <div className="flex flex-col">
        <span className="text-body-sm font-medium text-foreground">
          {employee.displayName ?? 'Unknown'}
        </span>
        <BodySmall color="foreground-subtle">
          {employee.employeeNumber ?? '—'}
        </BodySmall>
      </div>
    </div>
    <BodySmall color="foreground-subtle">{roleName}</BodySmall>
  </div>
);

export const RoleUsersTab = ({
  employees,
  loading,
  roleName,
}: RoleUsersTabProps) => {
  if (loading) {
    return (
      <BodySmall className="px-6 py-4" color="foreground-subtle">
        Loading users…
      </BodySmall>
    );
  }

  if (employees.length === 0) {
    return (
      <BodySmall className="px-6 py-4" color="foreground-subtle">
        {NO_USERS_FOR_ROLE}
      </BodySmall>
    );
  }

  return (
    <div className="px-6 py-2">
      {employees.map((employee) => (
        <RoleUserRow
          employee={employee}
          key={employee.id}
          roleName={roleName}
        />
      ))}
    </div>
  );
};
