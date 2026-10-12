import type { QueryClient } from '@tanstack/react-query';
import type { SalesPipelineStatusSummaryDto } from '@cms/settings-contract';
import type { SalesPipelineStatusForm } from '@cms/settings-data-access';

export interface SalesPipelineStatusPageProps {
  queryClient: QueryClient;
}

export type SalesPipelineStatusFilter = 'active' | 'inactive';

export interface SalesPipelineStatusHeaderProps {
  onAdd: () => void;
}

export interface SalesPipelineStatusFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SalesPipelineStatusForm) => void;
  open: boolean;
  status: SalesPipelineStatusSummaryDto | null;
}

export interface SalesPipelineStatusDeactivateDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  status: SalesPipelineStatusSummaryDto | null;
}

export interface SalesPipelineStatusDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface SalesPipelineStatusTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onDeactivate: (record: SalesPipelineStatusSummaryDto) => void;
  onEdit: (record: SalesPipelineStatusSummaryDto) => void;
  queryClient: QueryClient;
}
