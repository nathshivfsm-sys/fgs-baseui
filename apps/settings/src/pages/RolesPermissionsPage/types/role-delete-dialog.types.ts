import type { RoleSummaryDto } from '@cms/user-contract';

export interface RoleDeleteDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  role: RoleSummaryDto | null;
}
