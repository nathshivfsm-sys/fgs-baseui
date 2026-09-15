import type { QueryClient } from '@tanstack/react-query';
import type { GlBreakCreateDto, GlBreakSummaryDto } from '@cms/settings-contract';
import type { BusinessUnitCatalog } from './catalog.types';

export interface BusinessUnitPageProps {
  queryClient: QueryClient;
}

export interface BusinessUnitHeaderProps {
  catalog: BusinessUnitCatalog;
}

export interface BusinessUnitNavPanelProps {
  activeBreakTwoCount: number | undefined;
  activeBusinessUnitCount: number | undefined;
  catalog: BusinessUnitCatalog;
  onCatalogChange: (catalog: BusinessUnitCatalog) => void;
}

export interface GlBreakTablePanelProps {
  activeCount: number;
  addLabel: string;
  breakLevel: number;
  inactiveCount: number;
  nameHeader: string;
  onAdd: () => void;
  onEdit: (record: GlBreakSummaryDto) => void;
  queryClient: QueryClient;
  tableLabel: string;
}

export interface GlBreakFormDialogProps {
  breakLevel: number;
  catalog: BusinessUnitCatalog;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: GlBreakCreateDto) => void;
  open: boolean;
  record: GlBreakSummaryDto | null;
}
