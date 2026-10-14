import type { QueryClient } from '@tanstack/react-query';
import type { EmployeeSummaryDto } from '@cms/settings-contract';
import type { PermissionLookupDto } from '@cms/user-contract';
import type { RoleSummaryDto } from '@cms/user-contract';

export interface RolesPermissionsPageProps {
  queryClient: QueryClient;
}

export type RoleDetailTab = 'back-office' | 'mobile' | 'users';

export interface RoleListPanelProps {
  customRoles: RoleSummaryDto[];
  employeeCountByRole: Map<number, number>;
  onSelectRole: (roleId: number) => void;
  selectedRoleId: number | null;
  seededRoles: RoleSummaryDto[];
}

export interface RoleDetailPanelProps {
  activeTab: RoleDetailTab;
  canEdit: boolean;
  dirty: boolean;
  employeeCount: number;
  employees: EmployeeSummaryDto[];
  employeesLoading: boolean;
  onCancel: () => void;
  onClone: () => void;
  onSave: () => void;
  onTabChange: (tab: RoleDetailTab) => void;
  onTogglePermission: (permissionId: number, checked: boolean) => void;
  permissionCatalog: readonly PermissionLookupDto[];
  permissionCatalogLoading: boolean;
  permissionsLoading: boolean;
  roleLoading: boolean;
  roleName: string | null;
  savePending: boolean;
  selectedPermissionIds: ReadonlySet<number>;
  seeded: boolean;
}
