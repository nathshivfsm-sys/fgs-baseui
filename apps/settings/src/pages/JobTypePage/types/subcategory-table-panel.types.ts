import type { SubcategoryRow } from './job-type-page.types';

export interface SubcategoryTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onEdit: (row: SubcategoryRow) => void;
  rows: readonly SubcategoryRow[];
}
