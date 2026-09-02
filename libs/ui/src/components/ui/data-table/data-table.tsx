import { useTable, type RowData } from '@tanstack/react-table';
import { useId, useMemo, useState } from 'react';
import { cn } from '../../../lib/cn';
import { Table } from '../table';
import {
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
import type { DataTableProps } from './types';

export type {
  DataTableAdvancedOptions,
  DataTableManualMode,
  DataTableProps,
  DataTableState,
  DataTableStatus,
} from './types';

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
  errorState,
  filterActive,
  filterContent,
  getRowId,
  getRowLabel,
  initialState,
  manual,
  menuContent,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onGlobalFilterChange,
  onPaginationChange,
  onRowActivate,
  onRowClick,
  onRowSelectionChange,
  onSortingChange,
  pageSizeOptions,
  rowLabel = 'rows',
  searchPlaceholder = 'Search...',
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

  const resolvedColumns = useMemo(
    () =>
      enableRowSelection
        ? [createDataTableSelectionColumn<TData>(), ...columns]
        : [...columns],
    [columns, enableRowSelection],
  );

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
    state: { ...state, globalFilter },
    initialState: {
      ...initialState,
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
          rowActivation={rowActivation}
          rowLabel={rowLabel}
          status={resolvedStatus}
          table={table}
        />
      </Table>

      {enablePagination ? (
        <DataTablePagination
          pageSizeOptions={pageSizeOptions}
          rowLabel={rowLabel}
          table={table}
        />
      ) : null}
    </div>
  );
}
