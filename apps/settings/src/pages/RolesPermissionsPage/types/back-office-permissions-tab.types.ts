import type { PermissionLookupDto } from '@cms/user-contract';

export interface BackOfficePermissionsTabProps {
  allowedPermissionIds: ReadonlySet<number>;
  canEdit: boolean;
  catalog: readonly PermissionLookupDto[];
  onTogglePermission: (permissionId: number, checked: boolean) => void;
  selectedPermissionIds: ReadonlySet<number>;
}
