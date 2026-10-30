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
  LINE_DELETE_CONFIRM_LABEL,
  LINE_DELETE_DESCRIPTION,
  LINE_DELETE_TITLE,
} from '../constant';
import type { PricebookLineDeleteDialogProps } from '../types';

export const PricebookLineDeleteDialog = ({
  isPending,
  line,
  onConfirm,
  onOpenChange,
  open,
}: PricebookLineDeleteDialogProps) => {
  const name = line?.itemCode?.trim() || 'this line';

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
            {LINE_DELETE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {LINE_DELETE_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <BodySmall color="foreground-subtle">
          Delete <span className="font-semibold text-foreground">{name}</span>?
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
            {LINE_DELETE_CONFIRM_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
