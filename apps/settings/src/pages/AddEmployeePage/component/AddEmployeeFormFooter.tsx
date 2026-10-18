import { Button } from '@cms/ui';
import { CANCEL_LABEL } from '../constant';
import type { AddEmployeeFormFooterProps } from '../types';

export const AddEmployeeFormFooter = ({
  formId,
  isPending,
  onCancel,
  saveLabel,
}: AddEmployeeFormFooterProps) => (
  <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-surface px-8 py-3.5">
    <Button
      disabled={isPending}
      onClick={onCancel}
      type="button"
      variant="outline"
    >
      {CANCEL_LABEL}
    </Button>
    <Button form={formId} loading={isPending} type="submit">
      {saveLabel}
    </Button>
  </footer>
);
