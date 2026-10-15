import type { PaginationState, SortingState } from '@tanstack/react-table';
import type { DataTableManualMode } from './data-table.types';

/** How list data is loaded and processed before it reaches `DataTable`. */
export type DataTableDataMode = 'client' | 'server';

export const DATA_TABLE_CLIENT_MAX_PAGE_SIZE = 1000;

export interface DataTableListRequestSlice {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface BuildDataTableListRequestOptions {
  mode?: DataTableDataMode;
  pagination: PaginationState;
  sorting?: SortingState;
  globalFilter?: string;
  /**
   * Server mode only: fetch up to {@link DATA_TABLE_CLIENT_MAX_PAGE_SIZE} rows in
   * one request so a caller can filter or paginate them in the UI.
   */
  prefetchAllRows?: boolean;
  clientMaxPageSize?: number;
  /** When false, search stays in table state and is not sent to the list API. */
  enableServerSearch?: boolean;
  /** When set, sorting is included in the list API request (server mode). */
  serverManual?: Pick<DataTableManualMode, 'sorting' | 'filtering'>;
}

export interface ResolveDataTableRowsOptions<TData> {
  mode?: DataTableDataMode;
  pagination: PaginationState;
  items: readonly TData[];
  totalCount: number;
  /** Applied before pagination; in server mode requires {@link prefetchAllRows}. */
  filterItems?: (items: readonly TData[]) => readonly TData[];
  serverManual?: Pick<DataTableManualMode, 'sorting' | 'filtering'>;
}

export interface ResolveDataTableRowsResult<TData> {
  rows: readonly TData[];
  manual?: DataTableManualMode;
}
