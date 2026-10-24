import type { QueryClient } from '@tanstack/react-query';
import type {
  PermissionLookupDto,
  RoleSummaryDto,
  UserSummaryDto,
} from '@cms/user-contract';

export interface RolesPermissionsPageProps {
  queryClient: QueryClient;
}

export type RoleDetailTab = 'back-office' | 'mobile' | 'users';

export interface RoleListPanelProps {
  customRoles: RoleSummaryDto[];
  userCountByRole: Map<number, number>;
  onDeleteRole: (roleId: number) => void;
  onSelectRole: (roleId: number) => void;
  selectedRoleId: number | null;
  seededRoles: RoleSummaryDto[];
}

export interface RoleDetailPanelProps {
  activeTab: RoleDetailTab;
  allowedPermissionIds: ReadonlySet<number>;
  canEdit: boolean;
  dirty: boolean;
  userCount: number;
  users: UserSummaryDto[];
  usersLoading: boolean;
  onCancel: () => void;
  onOpenCloneDialog: () => void;
  onDeleteRole: () => void;
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
