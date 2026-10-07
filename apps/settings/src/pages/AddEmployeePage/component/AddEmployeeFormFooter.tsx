import { Button } from '@cms/ui';
import { CANCEL_LABEL, SAVE_EMPLOYEE_LABEL } from '../constant';

export interface AddEmployeeFormFooterProps {
  formId: string;
  isPending: boolean;
  onCancel: () => void;
}

export const AddEmployeeFormFooter = ({
  formId,
  isPending,
  onCancel,
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
      {SAVE_EMPLOYEE_LABEL}
    </Button>
  </footer>
);
