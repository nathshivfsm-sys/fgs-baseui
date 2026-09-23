import { useTable, type RowData } from '@tanstack/react-table';
import { useId, useMemo, useState } from 'react';
import { cn } from '../../../lib/cn';
import { Table } from '../table';
import {
  createDataTableExpandColumn,
  createDataTableSelectionColumn,
  DataTableBody,
  DataTableControls,
  DataTableHeader,
  DataTablePagination,
  DataTableStatusMessage,
} from './components';
import {
  dataTableFeatures,
  type DataTableFeatures,
  type DataTableInstance,
} from './data-table-features';
import type {
  DataTableColumnDefinition,
  DataTableProps,
} from './types';

export type {
  DataTableAdvancedOptions,
  DataTableManualMode,
  DataTableProps,
  DataTableState,
  DataTableStatus,
} from './types';
export type { ExpandedState } from '@tanstack/react-table';

/**
 * Design-system data grid built on TanStack Table v9.
 *
 * The table owns feature state by default. Supply `state` with matching change
 * callbacks when query state, routing, or another component needs ownership.
 * `manual` switches filtering, sorting, and pagination to server processing;
 * fetching and request cancellation remain in the feature/query layer.
 */
export function DataTable<TData extends RowData>({
  className,
  columns,
  data,
  defaultPageSize,
  emptyState = 'No results found',
  enableColumnResizing = false,
  showColumnVisibility = true,
  enablePagination = true,
  enableRowSelection = true,
  enableSearch = true,
  enableExpanding,
  errorState,
  filterActive,
  filterContent,
  getRowCanExpand,
  getRowExpandLabel,
  getRowId,
  getRowLabel,
  getSubRows,
  initialState,
  manual,
  menuContent,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onExpandedChange,
  onGlobalFilterChange,
  onPaginationChange,
  onRowActivate,
  onRowClick,
  onRowSelectionChange,
  onSortingChange,
  formatPageSizeOption,
  pageSizeLabel,
  pageSizeOptions,
  paginateExpandedRows = false,
  renderExpandedRow,
  rowLabel = 'rows',
  searchPlaceholder = 'Search...',
  showExpandColumn,
  state,
  status,
  tableLabel,
  tableOptions,
  toolbarActions,
  toolbarStart,
}: DataTableProps<TData>) {
  const statusId = useId();
  const resolvedDefaultPageSize = defaultPageSize ?? 10;
  const resolvedStatus = status ?? 'idle';
  const rowActivation = onRowActivate ?? onRowClick;
  const [internalGlobalFilter, setInternalGlobalFilter] = useState(
    initialState?.globalFilter ?? '',
  );
  const globalFilter = state?.globalFilter ?? internalGlobalFilter;
  const handleGlobalFilterChange =
    state?.globalFilter === undefined
      ? setInternalGlobalFilter
      : onGlobalFilterChange;

  const expandingEnabled =
    enableExpanding ??
    Boolean(renderExpandedRow || getSubRows);

  const resolvedShowExpandColumn =
    showExpandColumn ?? (expandingEnabled && Boolean(renderExpandedRow || getSubRows));

  const [internalExpanded, setInternalExpanded] = useState(
    initialState?.expanded ?? {},
  );
  const expanded = state?.expanded ?? internalExpanded;
  const handleExpandedChange =
    state?.expanded === undefined ? setInternalExpanded : onExpandedChange;

  const resolvedColumns = useMemo(() => {
    const pinnedLeading = columns.filter(
      (column) => column.meta?.pin === 'leading',
    );
    const bodyColumns = columns.filter((column) => column.meta?.pin !== 'leading');
    const prefix: DataTableColumnDefinition<TData>[] = [...pinnedLeading];
    if (resolvedShowExpandColumn) {
      prefix.push(
        createDataTableExpandColumn<TData>({
          getRowCanExpand,
          getRowExpandLabel,
        }),
      );
    }
    if (enableRowSelection) {
      prefix.push(createDataTableSelectionColumn<TData>());
    }
    return [...prefix, ...bodyColumns];
  }, [
    columns,
    enableRowSelection,
    getRowCanExpand,
    getRowExpandLabel,
    resolvedShowExpandColumn,
  ]);

  const table: DataTableInstance<TData> = useTable<DataTableFeatures, TData>({
    ...tableOptions,
    features: dataTableFeatures,
    columns: resolvedColumns,
    data,
    enableColumnResizing,
    enableRowSelection,
    columnResizeMode: 'onChange',
    globalFilterFn: 'includesString',
    getRowId,
    getSubRows,
    getRowCanExpand: (row) => {
      if (getRowCanExpand) {
        return getRowCanExpand(row.original);
      }
      if (renderExpandedRow) {
        return true;
      }
      const subRows = getSubRows?.(row.original);
      return Boolean(subRows && subRows.length > 0);
    },
    paginateExpandedRows,
    state: { ...state, expanded, globalFilter },
    initialState: {
      ...initialState,
      expanded: initialState?.expanded ?? {},
      globalFilter: initialState?.globalFilter ?? '',
      pagination: initialState?.pagination ?? {
        pageIndex: 0,
        pageSize: resolvedDefaultPageSize,
      },
    },
    manualFiltering: manual?.filtering,
    manualPagination: manual?.pagination,
    manualSorting: manual?.sorting,
    pageCount: manual?.pageCount,
    rowCount: manual?.rowCount,
    ...(handleGlobalFilterChange
      ? { onGlobalFilterChange: handleGlobalFilterChange }
      : {}),
    ...(handleExpandedChange ? { onExpandedChange: handleExpandedChange } : {}),
    ...(onColumnFiltersChange ? { onColumnFiltersChange } : {}),
    ...(onColumnVisibilityChange ? { onColumnVisibilityChange } : {}),
    ...(onPaginationChange ? { onPaginationChange } : {}),
    ...(onRowSelectionChange ? { onRowSelectionChange } : {}),
    ...(onSortingChange ? { onSortingChange } : {}),
  });

  const columnCount = Math.max(table.getVisibleLeafColumns().length, 1);
  const currentPageSize =
    table.state.pagination?.pageSize ?? resolvedDefaultPageSize;
  const isBusy =
    resolvedStatus === 'loading' || resolvedStatus === 'refetching';
  const isError = resolvedStatus === 'error';

  return (
    <div
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-xl border border-border bg-surface',
        className,
      )}
    >
      <DataTableStatusMessage
        id={statusId}
        rowCount={table.getRowCount()}
        rowLabel={rowLabel}
        status={resolvedStatus}
      />

      <DataTableControls
        showColumnVisibility={showColumnVisibility}
        enableSearch={enableSearch}
        filterActive={filterActive}
        filterContent={filterContent}
        globalFilter={globalFilter}
        menuContent={menuContent}
        searchPlaceholder={searchPlaceholder}
        table={table}
        toolbarActions={toolbarActions}
        toolbarStart={toolbarStart}
      />

      <Table
        aria-busy={isBusy || undefined}
        aria-describedby={isBusy || isError ? statusId : undefined}
        aria-label={tableLabel ?? `${rowLabel} table`}
      >
        <DataTableHeader
          enableColumnResizing={enableColumnResizing}
          headerGroups={table.getHeaderGroups()}
          table={table}
        />
        <DataTableBody
          columnCount={columnCount}
          currentPageSize={currentPageSize}
          emptyState={emptyState}
          enableRowSelection={enableRowSelection}
          errorState={errorState}
          getRowLabel={getRowLabel}
          renderExpandedRow={renderExpandedRow}
          rowActivation={rowActivation}
          rowLabel={rowLabel}
          status={resolvedStatus}
          table={table}
        />
      </Table>

      {enablePagination ? (
        <DataTablePagination
          formatPageSizeOption={formatPageSizeOption}
          pageSizeLabel={pageSizeLabel}
          pageSizeOptions={pageSizeOptions}
          rowLabel={rowLabel}
          table={table}
        />
      ) : null}
    </div>
  );
}
