import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import {
  DEACTIVATE_BILLING_CATEGORY_DESCRIPTION,
  DEACTIVATE_BILLING_CATEGORY_TITLE,
  DEACTIVATE_CONFIRM_LABEL,
} from '../constant';
import type { BillingCategoryDeactivateDialogProps } from '../types';

export const BillingCategoryDeactivateDialog = ({
  billingCategory,
  isPending,
  onConfirm,
  onOpenChange,
  open,
}: BillingCategoryDeactivateDialogProps) => {
  const name =
    billingCategory?.billingCategoryName?.trim() || 'this billing category';

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
            {DEACTIVATE_BILLING_CATEGORY_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {DEACTIVATE_BILLING_CATEGORY_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <p className="text-control text-foreground-subtle">
          Deactivate{' '}
          <span className="font-semibold text-foreground">{name}</span>?
        </p>
        <div className="flex justify-end gap-2">
          <Button
            disabled={isPending}
            onClick={handleCancel}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            loading={isPending}
            onClick={handleConfirm}
            type="button"
            variant="destructive"
          >
            {DEACTIVATE_CONFIRM_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
