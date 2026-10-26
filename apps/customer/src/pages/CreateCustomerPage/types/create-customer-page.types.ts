import type { QueryClient } from '@tanstack/react-query';
import type { CustomerCreateForm } from '@cms/customer-data-access';

export interface CreateCustomerPageProps {
  queryClient: QueryClient;
}

export interface CreateCustomerHeaderProps {
  creationOption: CustomerCreateForm['creationOption'];
  onBack: () => void;
}

export interface DiscardChangesDialogProps {
  onConfirmDiscard: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface CreateCustomerFormFooterProps {
  creationOption: CustomerCreateForm['creationOption'];
  formId: string;
  isPending: boolean;
  onCancel: () => void;
}
