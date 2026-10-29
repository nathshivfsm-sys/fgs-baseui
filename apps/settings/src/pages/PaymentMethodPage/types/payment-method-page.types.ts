import type { QueryClient } from '@tanstack/react-query';
import type { PaymentMethodSummaryDto } from '@cms/settings-contract';
import type { PaymentMethodForm } from '@cms/settings-data-access';

export interface PaymentMethodPageProps {
  queryClient: QueryClient;
}

export type PaymentMethodStatusFilter = 'active' | 'inactive';

export interface PaymentMethodHeaderProps {
  onAdd: () => void;
}

export interface PaymentMethodFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PaymentMethodForm) => void;
  open: boolean;
  paymentMethod: PaymentMethodSummaryDto | null;
}

export interface PaymentMethodDeactivateDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  paymentMethod: PaymentMethodSummaryDto | null;
}

export interface PaymentMethodDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface PaymentMethodTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onDeactivate: (record: PaymentMethodSummaryDto) => void;
  onEdit: (record: PaymentMethodSummaryDto) => void;
  queryClient: QueryClient;
}
