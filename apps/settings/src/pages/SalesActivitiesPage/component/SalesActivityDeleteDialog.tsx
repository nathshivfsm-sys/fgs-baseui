import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  TrashIcon,
} from '@cms/ui';
import { DELETE_CONFIRM_LABEL } from '../constant';
import type { SalesActivityDeleteDialogProps } from '../types';

export const SalesActivityDeleteDialog = ({
  isPending,
  name,
  onConfirm,
  onOpenChange,
  open,
  title,
}: SalesActivityDeleteDialogProps) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-0 p-6 sm:max-w-md">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TrashIcon aria-hidden className="size-4" />
        </div>
        <DialogHeader className="items-center gap-1.5 pt-3.5 text-center sm:text-center">
          <DialogTitle className="text-title font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-control text-foreground-subtle">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">{name}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-2 gap-2">
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
            {DELETE_CONFIRM_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
