import { Button } from '@cms/ui';
import type { DialogFooterActionsProps } from '../../../types';

export const DialogFooterActions = ({
  cancelDisabled,
  onCancel,
  onPrimary,
  primaryLabel,
  primaryLoading,
  primaryType = 'button',
  primaryVariant = 'action',
}: DialogFooterActionsProps) => (
  <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
    <Button
      disabled={cancelDisabled}
      onClick={onCancel}
      type="button"
      variant="outline"
    >
      Cancel
    </Button>
    <Button
      loading={primaryLoading}
      onClick={onPrimary}
      type={primaryType}
      variant={primaryVariant}
    >
      {primaryLabel}
    </Button>
  </div>
);
