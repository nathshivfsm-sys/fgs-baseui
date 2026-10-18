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
  DISCARD_CONTINUE_LABEL,
  DISCARD_DESCRIPTION,
  DISCARD_TITLE,
} from '../constant';
import type { EmployeeDiscardDialogProps } from '../types';

export const EmployeeDiscardDialog = ({
  onConfirm,
  onOpenChange,
  open,
}: EmployeeDiscardDialogProps) => {
  const handleContinue = () => {
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
          <Button onClick={handleContinue} type="button" variant="outline">
            {DISCARD_CONTINUE_LABEL}
          </Button>
          <Button onClick={handleConfirm} type="button" variant="destructive">
            {DISCARD_CONFIRM_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
