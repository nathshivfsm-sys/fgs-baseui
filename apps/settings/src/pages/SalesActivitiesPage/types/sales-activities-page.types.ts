import type { QueryClient } from '@tanstack/react-query';
import type {
  SalesActivityOutcomeSummaryDto,
  SalesActivityTypeSummaryDto,
  SalesPipelineStatusLookupDto,
} from '@cms/settings-contract';
import type {
  SalesActivityOutcomeForm,
  SalesActivityTypeForm,
} from '@cms/settings-data-access';

export interface SalesActivitiesPageProps {
  queryClient: QueryClient;
}

export type SalesActivitiesCatalog = 'activity' | 'outcome';

export type SalesActivitiesStatusFilter = 'active' | 'inactive';

export interface SalesActivitiesHeaderProps {
  createLabel: string;
  onAdd: () => void;
}

export interface SalesActivitiesNavPanelProps {
  activityActiveCount?: number;
  activityInactiveCount?: number;
  catalog: SalesActivitiesCatalog;
  onCatalogChange: (catalog: SalesActivitiesCatalog) => void;
  outcomeActiveCount?: number;
  outcomeInactiveCount?: number;
}

export interface SalesActivityTablePanelProps {
  activeCount: number;
  error: unknown;
  inactiveCount: number;
  isError: boolean;
  isFetching: boolean;
  isPending: boolean;
  items: readonly SalesActivityTypeSummaryDto[];
  onDelete: (record: SalesActivityTypeSummaryDto) => void;
  onEdit: (record: SalesActivityTypeSummaryDto) => void;
}

export interface SalesActivityOutcomeTablePanelProps {
  activeCount: number;
  error: unknown;
  inactiveCount: number;
  isError: boolean;
  isFetching: boolean;
  isPending: boolean;
  items: readonly SalesActivityOutcomeSummaryDto[];
  onDelete: (record: SalesActivityOutcomeSummaryDto) => void;
  onEdit: (record: SalesActivityOutcomeSummaryDto) => void;
  statusCodeById: ReadonlyMap<number, string>;
}

export interface SalesActivityFormDialogProps {
  activity: SalesActivityTypeSummaryDto | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SalesActivityTypeForm) => void;
  open: boolean;
}

export interface SalesActivityOutcomeFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SalesActivityOutcomeForm) => void;
  open: boolean;
  outcome: SalesActivityOutcomeSummaryDto | null;
  statusOptions: readonly SalesPipelineStatusLookupDto[];
}

export interface SalesActivityDeleteDialogProps {
  isPending: boolean;
  name: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
}

export interface SalesActivityDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}
