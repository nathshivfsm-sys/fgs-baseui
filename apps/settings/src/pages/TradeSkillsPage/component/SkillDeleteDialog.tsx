import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import { DELETE_SKILL_LABEL, DELETE_SKILL_TITLE } from '../constant';
import type { SkillDeleteDialogProps } from '../types';

export const SkillDeleteDialog = ({
  isPending,
  onConfirm,
  onOpenChange,
  open,
  skill,
}: SkillDeleteDialogProps) => {
  const name = skill?.name?.trim() || skill?.code?.trim() || 'this skill';

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {DELETE_SKILL_TITLE}
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
            {DELETE_SKILL_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
