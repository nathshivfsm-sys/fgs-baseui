import { useMemo, useState } from 'react';
import type { PriceBookSummaryDto } from '@cms/settings-contract';
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableBooleanCell,
  DataTableRowActions,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar, type CatalogStatusFilter } from '../../../shared';
import {
  EMPTY_LIST_FILTERS,
  NO_SERVICES_FOUND,
  PRICEBOOK_TABLE_PAGE_SIZE,
  SEARCH_PLACEHOLDER,
} from '../constant';
import type {
  PricebookListFilters,
  PricebookRowActionsProps,
  PricebookTablePanelProps,
} from '../types';
import { filterPriceBooks, formatPrice } from '../util';
import { PricebookListFilter } from './PricebookListFilter';

const column = createDataTableColumnHelper<PriceBookSummaryDto>();

const formatPageSize = (size: number) => `${size} per page`;

const PricebookRowActions = ({
  onDeactivate,
  onEdit,
  row,
}: PricebookRowActionsProps) => {
  const displayName = row.priceBookName?.trim() || 'service';

  const handleEdit = () => {
    onEdit(row);
  };

  const handleDeactivate = () => {
    onDeactivate(row);
  };

  if (!row.isActive) {
    return (
      <DataTableRowActions
        editLabel={`Edit ${displayName}`}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <DataTableRowActions
      deleteLabel={`Deactivate ${displayName}`}
      editLabel={`Edit ${displayName}`}
      onDelete={handleDeactivate}
      onEdit={handleEdit}
    />
  );
};

export const PricebookTablePanel = ({
  activeCount,
  inactiveCount,
  jobTypes,
  loadError,
  onDeactivate,
  onEdit,
  rows,
  tableStatus,
}: PricebookTablePanelProps) => {
  const [status, setStatus] = useState<CatalogStatusFilter>('active');
  const [search, setSearch] = useState('');
  const [appliedFilters, setAppliedFilters] =
    useState<PricebookListFilters>(EMPTY_LIST_FILTERS);
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: PRICEBOOK_TABLE_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'priceBookName', desc: false },
  ]);

  const jobTypeNames = useMemo(() => {
    const names: Record<number, string> = {};
    for (const jobType of jobTypes) {
      names[jobType.id] =
        jobType.name?.trim() || jobType.jobTypeCode?.trim() || '—';
    }
    return names;
  }, [jobTypes]);

  const filteredRows = useMemo(
    () => filterPriceBooks(rows, status, search, appliedFilters),
    [appliedFilters, rows, search, status],
  );

  const columns = useMemo(
    () => [
      column.accessor('priceBookCode', {
        header: 'ID',
        enableSorting: true,
        meta: { label: 'ID' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('priceBookName', {
        header: 'Name',
        enableSorting: true,
        meta: { label: 'Name' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor((row) => jobTypeNames[row.jobTypeId] ?? '', {
        id: 'jobType',
        header: 'Job Type',
        enableSorting: true,
        meta: { label: 'Job Type' },
        cell: ({ row }) => jobTypeNames[row.original.jobTypeId] ?? '—',
      }),
      column.accessor('isTaxable', {
        header: 'Is Taxable',
        enableSorting: true,
        meta: { align: 'center', label: 'Is Taxable' },
        cell: ({ getValue }) => <DataTableBooleanCell value={getValue()} />,
      }),
      column.accessor('basePrice', {
        header: 'Price',
        enableSorting: true,
        meta: { align: 'right', label: 'Price' },
        cell: ({ getValue }) => formatPrice(getValue()),
      }),
      column.display({
        id: 'actions',
        header: 'Action',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Action' },
        cell: ({ row }) => (
          <PricebookRowActions
            onDeactivate={onDeactivate}
            onEdit={onEdit}
            row={row.original}
          />
        ),
      }),
    ],
    [jobTypeNames, onDeactivate, onEdit],
  );

  const resetPage = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleStatusChange = (next: CatalogStatusFilter) => {
    setStatus(next);
    resetPage();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetPage();
  };

  const handleFiltersApply = (filters: PricebookListFilters) => {
    setAppliedFilters(filters);
    resetPage();
  };

  const handleFiltersClear = () => {
    setAppliedFilters(EMPTY_LIST_FILTERS);
    resetPage();
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        filter={
          <PricebookListFilter
            appliedFilters={appliedFilters}
            jobTypes={jobTypes}
            onApply={handleFiltersApply}
            onClear={handleFiltersClear}
          />
        }
        inactiveCount={inactiveCount}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_PLACEHOLDER}
        searchValue={search}
        status={status}
      />
      <div className="min-h-0 min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="min-h-0 flex-1 rounded-none border-0"
          columns={columns}
          data={filteredRows}
          emptyState={NO_SERVICES_FOUND}
          enableRowSelection={false}
          enableSearch={false}
          errorState={tableStatus === 'error' ? loadError : undefined}
          formatPageSizeOption={formatPageSize}
          getRowId={(row) => String(row.id)}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          pageSizeLabel=""
          rowLabel="entries"
          showColumnVisibility={false}
          state={{ pagination, sorting }}
          status={tableStatus}
          tableLabel="Pricebook"
        />
      </div>
    </div>
  );
};
