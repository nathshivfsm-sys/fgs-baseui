import type {
  JobCategorySummaryDto,
  JobTypeDetailDto,
  SubcategorySummaryDto,
} from '@cms/settings-contract';
import type { JobTypeForm } from '@cms/settings-data-access';
import type { QueryClient } from '@tanstack/react-query';
import type { SelectOption } from '@cms/ui';
import type { JobTypeGroupRow } from './job-type-group.types';

export interface JobTypeCatalogProps {
  categories: readonly JobCategorySummaryDto[];
  queryClient: QueryClient;
}

export interface JobTypeFormDialogProps {
  businessUnitOptions: readonly SelectOption[];
  categories: readonly SelectOption[];
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: JobTypeForm) => void;
  open: boolean;
  record: JobTypeDetailDto | null;
  subcategories: readonly SubcategorySummaryDto[];
}

export interface JobTypeGroupedTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onEdit: (row: JobTypeGroupRow) => void;
  rows: readonly JobTypeGroupRow[];
  tableStatus?: 'idle' | 'loading' | 'error';
}
