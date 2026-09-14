import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import { DELETE_LABEL, DELETE_TITLE } from '../../../constant';
import type { NonWorkingDayDeleteDialogProps } from '../../../types';
import { formatNonWorkingDate } from '../../../util';
import { DialogFooterActions } from './DialogFooterActions';

export const NonWorkingDayDeleteDialog = ({
  isPending,
  onConfirm,
  onOpenChange,
  open,
  row,
}: NonWorkingDayDeleteDialogProps) => {
  const name = row?.name?.trim();
  const dateLabel = row ? formatNonWorkingDate(row.nonWorkingDate) : '';
  const description = name
    ? `This will remove ${name} on ${dateLabel}.`
    : `This will remove the non-working day on ${dateLabel}.`;

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {DELETE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooterActions
          cancelDisabled={isPending}
          onCancel={handleClose}
          onPrimary={onConfirm}
          primaryLabel={DELETE_LABEL}
          primaryLoading={isPending}
          primaryVariant="destructive"
        />
      </DialogContent>
    </Dialog>
  );
};
