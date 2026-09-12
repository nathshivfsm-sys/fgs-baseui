import type { NonWorkingDateSummaryDto } from '@cms/settings-contract';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import { DELETE_TITLE } from '../../constant';
import { formatNonWorkingDate } from '../../util';

export interface NonWorkingDayDeleteDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  row: NonWorkingDateSummaryDto | null;
}

export function NonWorkingDayDeleteDialog({
  isPending,
  onConfirm,
  onOpenChange,
  open,
  row,
}: NonWorkingDayDeleteDialogProps) {
  const name = row?.name?.trim();
  const dateLabel = row ? formatNonWorkingDate(row.nonWorkingDate) : '';
  const description = name
    ? `This will remove ${name} on ${dateLabel}.`
    : `This will remove the non-working day on ${dateLabel}.`;

  function handleClose() {
    onOpenChange(false);
  }

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
        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
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
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
