import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import type { DataTableState } from './types';

export interface UseDataTableQueryStateOptions {
  defaultPageSize?: number;
  initialGlobalFilter?: string;
  initialSorting?: SortingState;
}

export const useDataTableQueryState = ({
  defaultPageSize = 10,
  initialGlobalFilter = '',
  initialSorting = [],
}: UseDataTableQueryStateOptions = {}) => {
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [sorting, setSorting] =
    useState<DataTableState['sorting']>(initialSorting);
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter);

  const resetPageIndex = useCallback(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  }, []);

  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      setPagination((current) =>
        typeof updater === 'function' ? updater(current) : updater,
      );
    },
    [],
  );

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      setSorting((current) =>
        typeof updater === 'function' ? updater(current) : updater,
      );
      resetPageIndex();
    },
    [resetPageIndex],
  );

  const handleGlobalFilterChange: OnChangeFn<string> = useCallback(
    (updater) => {
      setGlobalFilter((current) =>
        typeof updater === 'function' ? updater(current) : updater,
      );
      resetPageIndex();
    },
    [resetPageIndex],
  );

  return {
    globalFilter,
    handleGlobalFilterChange,
    handlePaginationChange,
    handleSortingChange,
    pagination,
    resetPageIndex,
    setGlobalFilter,
    setPagination,
    setSorting,
    sorting,
  };
};
