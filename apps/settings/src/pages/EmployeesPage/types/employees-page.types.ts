import type { QueryClient } from '@tanstack/react-query';
import type { RoleLookupDto } from '@cms/user-contract';
import type { EmployeeSummaryDto } from '@cms/settings-contract';
import type { CatalogStatusFilter } from '../../../shared';

export interface EmployeesPageProps {
  queryClient: QueryClient;
}

export type EmployeeStatusFilter = CatalogStatusFilter;

export interface EmployeeTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onEdit: (employee: EmployeeSummaryDto) => void;
  queryClient: QueryClient;
  roles: readonly RoleLookupDto[] | undefined;
}

export interface EmployeesSummaryCardsProps {
  admins: number;
  loading?: boolean;
  totalEmployees: number;
}

export interface EmployeeListAvatarProps {
  displayName: string | null | undefined;
  employeeId: number;
}

export interface EmployeeRoleBadgeProps {
  roleName: string | null | undefined;
}

export interface EmployeeListRoleFilterProps {
  appliedRoleIds: readonly string[];
  onApply: (roleIds: readonly string[]) => void;
  onClear: () => void;
  roles: readonly RoleLookupDto[] | undefined;
}
