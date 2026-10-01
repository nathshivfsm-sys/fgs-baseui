import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import {
  DISCARD_CONFIRM_LABEL,
  DISCARD_DESCRIPTION,
  DISCARD_TITLE,
} from '../constant';
import type { BillingCategoryDiscardDialogProps } from '../types';

export const BillingCategoryDiscardDialog = ({
  onConfirm,
  onOpenChange,
  open,
}: BillingCategoryDiscardDialogProps) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {DISCARD_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {DISCARD_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm} type="button" variant="destructive">
            {DISCARD_CONFIRM_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
