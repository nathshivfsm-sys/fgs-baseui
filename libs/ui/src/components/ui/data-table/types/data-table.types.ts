import type {
  Column,
  ColumnFiltersState,
  ColumnVisibilityState,
  HeaderGroup,
  OnChangeFn,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
  TableOptions,
} from '@tanstack/react-table';
import type {
  ComponentProps,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import type {
  DataTableColumnDef,
  DataTableFeatures,
  DataTableInstance,
} from '../data-table-features';

export interface DataTableColumnMeta {
  align?: 'left' | 'center' | 'right';
  cellClassName?: string;
  headerClassName?: string;
  label?: string;
  wrap?: boolean;
}

export interface DataTableState {
  columnFilters: ColumnFiltersState;
  columnVisibility: ColumnVisibilityState;
  globalFilter: string;
  pagination: PaginationState;
  rowSelection: RowSelectionState;
  sorting: SortingState;
}

export interface DataTableManualMode {
  filtering?: boolean;
  pagination?: boolean;
  sorting?: boolean;
  pageCount?: number;
  rowCount?: number;
}
type ReservedDataTableOption =
  | 'columnResizeMode'
  | 'columns'
  | 'data'
  | 'enableColumnResizing'
  | 'enableRowSelection'
  | 'features'
  | 'getRowId'
  | 'globalFilterFn'
  | 'initialState'
  | 'manualFiltering'
  | 'manualPagination'
  | 'manualSorting'
  | 'onColumnFiltersChange'
  | 'onColumnVisibilityChange'
  | 'onGlobalFilterChange'
  | 'onPaginationChange'
  | 'onRowSelectionChange'
  | 'onSortingChange'
  | 'pageCount'
  | 'rowCount'
  | 'state';

export type DataTableAdvancedOptions<TData extends RowData> = Partial<
  Omit<TableOptions<DataTableFeatures, TData>, ReservedDataTableOption>
>;

export type DataTableStatus = 'idle' | 'loading' | 'refetching' | 'error';

// A table can contain columns with different accessor value types. TanStack's
// column definition is invariant in TValue, so the aggregate must erase it.
export type DataTableColumnDefinition<TData extends RowData> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DataTableColumnDef<TData, any>;

export interface DataTableProps<TData extends RowData> {
  className?: string;
  columns: readonly DataTableColumnDefinition<TData>[];
  data: readonly TData[];
  defaultPageSize?: number;
  emptyState?: ReactNode;
  enableColumnResizing?: boolean;
  showColumnVisibility?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableSearch?: boolean;
  errorState?: ReactNode;
  filterContent?: ReactNode;
  filterActive?: boolean;
  getRowLabel?: (row: TData) => string;
  getRowId: (row: TData, index: number) => string;
  initialState?: Partial<DataTableState>;
  manual?: DataTableManualMode;
  menuContent?: ReactNode;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onColumnVisibilityChange?: OnChangeFn<ColumnVisibilityState>;
  onGlobalFilterChange?: OnChangeFn<string>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onRowActivate?: (row: TData) => void;
  /** @deprecated Use onRowActivate. */
  onRowClick?: (row: TData) => void;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onSortingChange?: OnChangeFn<SortingState>;
  pageSizeOptions?: readonly number[];
  rowLabel?: string;
  searchPlaceholder?: string;
  state?: Partial<DataTableState>;
  status?: DataTableStatus;
  tableLabel?: string;
  tableOptions?: DataTableAdvancedOptions<TData>;
  toolbarActions?: ReactNode;
  toolbarStart?: ReactNode;
}

export interface DataTableColumnHeaderProps<TData extends RowData> {
  className?: string;
  children: ReactNode;
  column: Column<DataTableFeatures, TData, unknown>;
}

export interface DataTablePaginationProps<TData extends RowData> {
  className?: string;
  rowLabel?: string;
  pageSizeOptions?: readonly number[];
  siblingCount?: number;
  table: DataTableInstance<TData>;
}

export interface DataTableToolbarProps {
  className?: string;
  end?: ReactNode;
  start?: ReactNode;
}

export interface DataTableSearchProps {
  className?: string;
  label?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: string;
}
export interface DataTableFilterButtonProps {
  children: ReactNode;
  active?: boolean;
  label?: string;
}

export interface DataTableColumnsMenuProps<TData extends RowData> {
  label?: string;
  table: DataTableInstance<TData>;
}

export interface DataTableOverflowMenuProps {
  children: ReactNode;
  label?: string;
}

export interface DataTableLinkCellProps extends ComponentProps<'a'> {
  children: ReactNode;
}

export interface DataTableStackedCellProps {
  className?: string;
  primary: ReactNode;
  secondary?: ReactNode;
  tone?: 'strong' | 'muted';
}

export interface DataTableIconCellProps {
  className?: string;
  children: ReactNode;
  icon: ReactNode;
}

export interface DataTableRowAction {
  destructive?: boolean;
  disabled?: boolean;
  label: string;
  onSelect: () => void;
  separatorBefore?: boolean;
}

export interface DataTableRowActionsProps {
  actions?: readonly DataTableRowAction[];
  className?: string;
  menuLabel?: string;
  onEdit?: () => void;
  editLabel?: string;
}

export type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

export type DataTableRowActivationEvent =
  | ReactMouseEvent<HTMLTableRowElement>
  | ReactKeyboardEvent<HTMLTableRowElement>;
export interface DataTableHeaderProps<TData extends RowData> {
  enableColumnResizing: boolean;
  headerGroups: HeaderGroup<DataTableFeatures, TData>[];
  table: DataTableInstance<TData>;
}

export interface DataTableBodyProps<TData extends RowData> {
  columnCount: number;
  currentPageSize: number;
  emptyState: ReactNode;
  enableRowSelection: boolean;
  errorState?: ReactNode;
  getRowLabel?: (row: TData) => string;
  rowActivation?: (row: TData) => void;
  rowLabel: string;
  status: DataTableStatus;
  table: DataTableInstance<TData>;
}

export interface DataTableControlsProps<TData extends RowData> {
  showColumnVisibility: boolean;
  enableSearch: boolean;
  filterActive?: boolean;
  filterContent?: ReactNode;
  globalFilter: string;
  menuContent?: ReactNode;
  searchPlaceholder: string;
  table: DataTableInstance<TData>;
  toolbarActions?: ReactNode;
  toolbarStart?: ReactNode;
}

export interface DataTableStatusProps {
  id: string;
  rowCount: number;
  rowLabel: string;
  status: DataTableStatus;
}
