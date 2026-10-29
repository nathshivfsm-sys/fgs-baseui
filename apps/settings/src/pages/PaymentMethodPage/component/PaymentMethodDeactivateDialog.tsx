import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import {
  DEACTIVATE_CONFIRM_LABEL,
  DEACTIVATE_PAYMENT_METHOD_DESCRIPTION,
  DEACTIVATE_PAYMENT_METHOD_TITLE,
} from '../constant';
import type { PaymentMethodDeactivateDialogProps } from '../types';

export const PaymentMethodDeactivateDialog = ({
  isPending,
  onConfirm,
  onOpenChange,
  open,
  paymentMethod,
}: PaymentMethodDeactivateDialogProps) => {
  const name = paymentMethod?.displayName?.trim() || 'this payment method';

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
            {DEACTIVATE_PAYMENT_METHOD_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {DEACTIVATE_PAYMENT_METHOD_DESCRIPTION}
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
