import type { PermissionLookupDto } from '@cms/user-contract';
import type { RoleDetailDto } from '@cms/user-contract';

export interface CloneRoleDialogProps {
  allowedPermissionIds: ReadonlySet<number>;
  catalog: readonly PermissionLookupDto[];
  initialPermissionIds: ReadonlySet<number>;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: {
    name: string;
    permissionIds: number[];
  }) => void | Promise<void>;
  open: boolean;
  sourceRole: RoleDetailDto;
}
