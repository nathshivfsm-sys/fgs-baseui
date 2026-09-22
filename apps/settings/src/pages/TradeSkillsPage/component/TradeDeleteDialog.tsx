import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import { DELETE_TRADE_LABEL, DELETE_TRADE_TITLE } from '../constant';
import type { TradeDeleteDialogProps } from '../types';

export const TradeDeleteDialog = ({
  isPending,
  onConfirm,
  onOpenChange,
  open,
  trade,
}: TradeDeleteDialogProps) => {
  const name = trade?.name?.trim() || trade?.tradeCode?.trim() || 'this trade';

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {DELETE_TRADE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            This will permanently remove {name}.
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
            {DELETE_TRADE_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
