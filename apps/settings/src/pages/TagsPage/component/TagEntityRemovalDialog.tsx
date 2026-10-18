import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import {
  ENTITY_REMOVAL_CONFIRM_LABEL,
  ENTITY_REMOVAL_DESCRIPTION,
  ENTITY_REMOVAL_TITLE,
} from '../constant';
import type { TagEntityRemovalDialogProps } from '../types';

export const TagEntityRemovalDialog = ({
  onConfirm,
  onOpenChange,
  open,
}: TagEntityRemovalDialogProps) => {
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
            {ENTITY_REMOVAL_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {ENTITY_REMOVAL_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm} type="button" variant="destructive">
            {ENTITY_REMOVAL_CONFIRM_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
