import type {
  BuildDataTableListRequestOptions,
  DataTableListRequestSlice,
  ResolveDataTableRowsOptions,
  ResolveDataTableRowsResult,
} from '../types/data-table-data-mode.types';
import { DATA_TABLE_CLIENT_MAX_PAGE_SIZE } from '../types/data-table-data-mode.types';

const trimSearch = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export function buildDataTableListRequest(
  options: BuildDataTableListRequestOptions,
): DataTableListRequestSlice {
  const mode = options.mode ?? 'server';
  const maxSize = options.clientMaxPageSize ?? DATA_TABLE_CLIENT_MAX_PAGE_SIZE;
  const prefetch = mode === 'client' || options.prefetchAllRows;
  const enableServerSearch = options.enableServerSearch ?? true;

  if (prefetch) {
    const slice: DataTableListRequestSlice = {
      page: 1,
      pageSize: maxSize,
    };

    if (mode === 'server' && enableServerSearch) {
      const search = trimSearch(options.globalFilter);
      if (search) {
        slice.search = search;
      }
    }

    if (mode === 'server' && options.serverManual?.sorting) {
      const sort = options.sorting?.[0];
      if (sort) {
        slice.sortBy = sort.id;
        slice.sortDirection = sort.desc ? 'desc' : 'asc';
      }
    }

    return slice;
  }

  const slice: DataTableListRequestSlice = {
    page: options.pagination.pageIndex + 1,
    pageSize: options.pagination.pageSize,
  };

  if (enableServerSearch) {
    const search = trimSearch(options.globalFilter);
    if (search) {
      slice.search = search;
    }
  }

  if (options.serverManual?.sorting) {
    const sort = options.sorting?.[0];
    if (sort) {
      slice.sortBy = sort.id;
      slice.sortDirection = sort.desc ? 'desc' : 'asc';
    }
  }

  return slice;
}

export function resolveDataTableRows<TData>(
  options: ResolveDataTableRowsOptions<TData>,
): ResolveDataTableRowsResult<TData> {
  const mode = options.mode ?? 'server';
  const filtered = options.filterItems
    ? options.filterItems(options.items)
    : options.items;
  const serverManual = options.serverManual ?? {};

  if (mode === 'client') {
    return { rows: filtered, manual: undefined };
  }

  if (options.filterItems) {
    const pageStart =
      options.pagination.pageIndex * options.pagination.pageSize;
    const rows = filtered.slice(
      pageStart,
      pageStart + options.pagination.pageSize,
    );
    const rowCount = filtered.length;

    return {
      rows,
      manual: {
        pagination: true,
        ...serverManual,
        pageCount: Math.max(
          1,
          Math.ceil(rowCount / options.pagination.pageSize),
        ),
        rowCount,
      },
    };
  }

  const rowCount = options.totalCount;

  return {
    rows: options.items,
    manual: {
      pagination: true,
      ...serverManual,
      pageCount: Math.max(1, Math.ceil(rowCount / options.pagination.pageSize)),
      rowCount,
    },
  };
}
