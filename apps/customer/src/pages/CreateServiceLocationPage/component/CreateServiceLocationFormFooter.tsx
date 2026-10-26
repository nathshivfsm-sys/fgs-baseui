import { Button } from '@cms/ui';
import { CANCEL_LABEL, CREATE_SERVICE_LOCATION_LABEL } from '@cms/customer-ui';
import type { CreateServiceLocationFormFooterProps } from '../types';

export const CreateServiceLocationFormFooter = ({
  formId,
  isPending,
  onCancel,
}: CreateServiceLocationFormFooterProps) => (
  <footer className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-border bg-surface px-8 py-3.5">
    <Button
      disabled={isPending}
      onClick={onCancel}
      type="button"
      variant="outline"
    >
      {CANCEL_LABEL}
    </Button>
    <Button form={formId} loading={isPending} type="submit">
      {CREATE_SERVICE_LOCATION_LABEL}
    </Button>
  </footer>
);
