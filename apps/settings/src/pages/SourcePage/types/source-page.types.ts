import type { QueryClient } from '@tanstack/react-query';
import type { SourceSummaryDto } from '@cms/settings-contract';
import type { SourceForm } from '@cms/settings-data-access';

export interface SourcePageProps {
  queryClient: QueryClient;
}

export type SourceStatusFilter = 'active' | 'inactive';

export interface SourceHeaderProps {
  onAdd: () => void;
}

export interface SourceFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SourceForm) => void;
  open: boolean;
  source: SourceSummaryDto | null;
}

export interface SourceDeactivateDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  source: SourceSummaryDto | null;
}

export interface SourceDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface SourceTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onDeactivate: (record: SourceSummaryDto) => void;
  onEdit: (record: SourceSummaryDto) => void;
  queryClient: QueryClient;
}
