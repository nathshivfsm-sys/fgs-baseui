import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createCoreRowModel,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_equalsString,
  filterFn_inNumberRange,
  filterFn_includesString,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type ReactTable,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import type { DataTableColumnMeta } from './types';

/**
 * The feature set every `DataTable` runs on.
 *
 * TanStack Table v9 features are tree-shakable and opt-in, so this is the single
 * place that decides which capabilities the design system's grid supports. Row
 * model factories are registered here too, which is what enables client-side
 * sorting, filtering, pagination, faceting, and expansion.
 */
export const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  coreRowModel: createCoreRowModel(),
  expandedRowModel: createExpandedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  columnMeta: {} as DataTableColumnMeta,
  filterFns: {
    arrIncludesSome: filterFn_arrIncludesSome,
    equalsString: filterFn_equalsString,
    inNumberRange: filterFn_inNumberRange,
    includesString: filterFn_includesString,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

export type DataTableFeatures = typeof dataTableFeatures;

/** Column definition type bound to the design system's feature set. */
export type DataTableColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<DataTableFeatures, TData, TValue>;

/**
 * React table instance bound to the design system's feature set. This is the
 * `useTable` return type, so it also exposes `state`, `FlexRender`, and
 * `Subscribe` on top of the core table APIs.
 */
export type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>;

export type {
  ColumnFiltersState,
  ColumnVisibilityState,
  PaginationState,
  RowSelectionState,
  SortingState,
};

/**
 * Typed column builder for `DataTable`.
 *
 * @example
 * ```tsx
 * const column = createDataTableColumnHelper<Location>();
 * const columns = [
 *   column.accessor('name', { header: 'Location Name' }),
 *   column.display({ id: 'actions', header: 'Actions' }),
 * ];
 * ```
 */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}
