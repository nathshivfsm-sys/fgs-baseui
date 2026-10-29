import type { QueryClient } from '@tanstack/react-query';
import type { PaymentTermSummaryDto } from '@cms/settings-contract';
import type { PaymentTermForm } from '@cms/settings-data-access';

export interface PaymentTermPageProps {
  queryClient: QueryClient;
}

export type PaymentTermStatusFilter = 'active' | 'inactive';

export interface PaymentTermHeaderProps {
  onAdd: () => void;
}

export interface PaymentTermFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PaymentTermForm) => void;
  open: boolean;
  paymentTerm: PaymentTermSummaryDto | null;
}

export interface PaymentTermDeactivateDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  paymentTerm: PaymentTermSummaryDto | null;
}

export interface PaymentTermDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface PaymentTermTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onDeactivate: (record: PaymentTermSummaryDto) => void;
  onEdit: (record: PaymentTermSummaryDto) => void;
  queryClient: QueryClient;
}
