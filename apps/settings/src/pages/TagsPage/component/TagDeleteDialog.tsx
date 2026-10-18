import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import {
  DELETE_TAG_BLOCKED_DESCRIPTION,
  DELETE_TAG_BLOCKED_TITLE,
  DELETE_TAG_CONFIRM_LABEL,
  DELETE_TAG_DEACTIVATE_LABEL,
  DELETE_TAG_DESCRIPTION,
  DELETE_TAG_TITLE,
} from '../constant';
import type { TagDeleteDialogProps } from '../types';

export const TagDeleteDialog = ({
  isPending,
  onConfirm,
  onDeactivate,
  onOpenChange,
  open,
  tag,
}: TagDeleteDialogProps) => {
  const name = tag?.name?.trim() || 'this tag';
  const blocked = (tag?.usageCount ?? 0) > 0;

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleDeactivate = () => {
    onDeactivate();
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {blocked ? DELETE_TAG_BLOCKED_TITLE : DELETE_TAG_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {blocked ? DELETE_TAG_BLOCKED_DESCRIPTION : DELETE_TAG_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        {!blocked ? (
          <p className="text-control text-foreground-subtle">
            Delete <span className="font-semibold text-foreground">{name}</span>
            ?
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button
            disabled={isPending}
            onClick={handleCancel}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          {blocked ? (
            <Button
              loading={isPending}
              onClick={handleDeactivate}
              type="button"
            >
              {DELETE_TAG_DEACTIVATE_LABEL}
            </Button>
          ) : (
            <Button
              loading={isPending}
              onClick={handleConfirm}
              type="button"
              variant="destructive"
            >
              {DELETE_TAG_CONFIRM_LABEL}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
