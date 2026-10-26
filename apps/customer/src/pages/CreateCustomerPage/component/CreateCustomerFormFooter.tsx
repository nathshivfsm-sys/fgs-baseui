import { Button } from '@cms/ui';
import {
  CANCEL_LABEL,
  CREATE_CUSTOMER_AND_LOCATION_LABEL,
  CREATE_CUSTOMER_LABEL,
} from '@cms/customer-ui';
import type { CreateCustomerFormFooterProps } from '../types';

export const CreateCustomerFormFooter = ({
  creationOption,
  formId,
  isPending,
  onCancel,
}: CreateCustomerFormFooterProps) => {
  const submitLabel =
    creationOption === 'billToAndServiceLocation'
      ? CREATE_CUSTOMER_AND_LOCATION_LABEL
      : CREATE_CUSTOMER_LABEL;

  return (
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
        {submitLabel}
      </Button>
    </footer>
  );
};
