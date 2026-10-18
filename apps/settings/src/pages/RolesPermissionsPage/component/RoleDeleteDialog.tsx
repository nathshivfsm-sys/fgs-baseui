import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import {
  DELETE_ROLE_DESCRIPTION,
  DELETE_ROLE_LABEL,
  DELETE_ROLE_TITLE,
} from '../constant';
import type { RoleDeleteDialogProps } from '../types';

export const RoleDeleteDialog = ({
  isPending,
  onConfirm,
  onOpenChange,
  open,
  role,
}: RoleDeleteDialogProps) => {
  const name = role?.name?.trim() || role?.roleCode?.trim() || 'this role';

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {DELETE_ROLE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {DELETE_ROLE_DESCRIPTION} This will permanently remove {name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            disabled={isPending}
            onClick={handleClose}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            loading={isPending}
            onClick={onConfirm}
            type="button"
            variant="destructive"
          >
            {DELETE_ROLE_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
