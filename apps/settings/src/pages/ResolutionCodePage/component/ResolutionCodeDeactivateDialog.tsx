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
  DEACTIVATE_RESOLUTION_CODE_DESCRIPTION,
  DEACTIVATE_RESOLUTION_CODE_TITLE,
} from '../constant';
import type { ResolutionCodeDeactivateDialogProps } from '../types';

export const ResolutionCodeDeactivateDialog = ({
  isPending,
  onConfirm,
  onOpenChange,
  open,
  resolutionCode,
}: ResolutionCodeDeactivateDialogProps) => {
  const name =
    resolutionCode?.resolutionName?.trim() ||
    resolutionCode?.resolutionCode?.trim() ||
    'this resolution code';

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
            {DEACTIVATE_RESOLUTION_CODE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {DEACTIVATE_RESOLUTION_CODE_DESCRIPTION}
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
