import type { EmployeeSummaryDto } from '@cms/settings-contract';

export interface RoleUsersTabProps {
  employees: EmployeeSummaryDto[];
  loading: boolean;
  roleName: string;
}
