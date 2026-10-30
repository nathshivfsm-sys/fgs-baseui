import {
  BodySmall,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import {
  CANCEL_LABEL,
  DEACTIVATE_CONFIRM_LABEL,
  DEACTIVATE_DESCRIPTION,
  DEACTIVATE_TITLE,
} from '../constant';
import type { PricebookDeactivateDialogProps } from '../types';

export const PricebookDeactivateDialog = ({
  isPending,
  onConfirm,
  onOpenChange,
  open,
  priceBook,
}: PricebookDeactivateDialogProps) => {
  const name = priceBook?.priceBookName?.trim() || 'this service';

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
            {DEACTIVATE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {DEACTIVATE_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <BodySmall color="foreground-subtle">
          Deactivate{' '}
          <span className="font-semibold text-foreground">{name}</span>?
        </BodySmall>
        <div className="flex justify-end gap-2">
          <Button
            disabled={isPending}
            onClick={handleCancel}
            type="button"
            variant="outline"
          >
            {CANCEL_LABEL}
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
