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
  DISCARD_STAY_LABEL,
  DISCARD_TITLE,
} from '@cms/customer-ui';
import type { DiscardChangesDialogProps } from '../types';

export const DiscardChangesDialog = ({
  onConfirmDiscard,
  onOpenChange,
  open,
}: DiscardChangesDialogProps) => {
  const handleStay = () => {
    onOpenChange(false);
  };

  const handleDiscard = () => {
    onConfirmDiscard();
    onOpenChange(false);
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
        <div className="flex justify-end gap-3">
          <Button onClick={handleStay} type="button" variant="outline">
            {DISCARD_STAY_LABEL}
          </Button>
          <Button onClick={handleDiscard} type="button" variant="destructive">
            {DISCARD_CONFIRM_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
