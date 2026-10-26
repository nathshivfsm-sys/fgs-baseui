import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { formatLocaleMobile } from '@cms/shared-locale';
import type { CustomerSummaryDto } from '@cms/customer-contract';
import { customerListQueryOptions } from '@cms/customer-data-access';
import { tagLookupQueryOptions } from '@cms/shared-data-access';
import {
  Badge,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  DataTableStackedCell,
  LabelIcon,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  LOAD_CUSTOMERS_ERROR_TITLE,
  NO_CUSTOMERS_FOUND,
  NO_CUSTOMERS_SEARCH,
  SEARCH_CUSTOMERS_PLACEHOLDER,
} from '../constant';
import type {
  CustomerListFilters,
  CustomerStatusFilter,
  CustomerTablePanelProps,
} from '../types';
import {
  describeCustomerError,
  formatCustomerTagLabel,
  toCustomerListQueryFilters,
  useCustomerTablePreferences,
} from '../util';
import { CustomerListCriteriaBar } from './CustomerListCriteriaBar';
import { CustomerListFilter } from './CustomerListFilter';
import { useCustomerListLoadToast } from './use-customer-list-load-toast';

const column = createDataTableColumnHelper<CustomerSummaryDto>();

export const CustomerTablePanel = ({
  activeCount,
  appliedFilters,
  canEditCustomer,
  inactiveCount,
  onEdit,
  onFiltersApply,
  onFiltersClear,
  onView,
  queryClient,
  userId,
}: CustomerTablePanelProps) => {
  const [status, setStatus] = useState<CustomerStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'name', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const {
    columnSizing,
    columnVisibility,
    onColumnSizingChange,
    onColumnVisibilityChange,
  } = useCustomerTablePreferences(userId);

  const listFilters = toCustomerListQueryFilters(appliedFilters);

  const tagsQuery = useQuery(tagLookupQueryOptions(true), queryClient);

  const query = useQuery(
    customerListQueryOptions({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      isActive: status === 'active',
      sortBy: sorting[0]?.id,
      sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
      search: globalFilter.trim() || undefined,
      includeSummary: false,
      ...listFilters,
    }),
    queryClient,
  );

  useCustomerListLoadToast(
    query,
    LOAD_CUSTOMERS_ERROR_TITLE,
    describeCustomerError,
    'customers-list-load-error',
  );

  const columns = useMemo(
    () => [
      column.accessor('isPreferredCustomer', {
        id: 'isPreferredCustomer',
        header: 'Preferred Customer',
        meta: { label: 'Preferred Customer', align: 'center' },
        cell: ({ getValue }) =>
          getValue() ? (
            <LabelIcon
              aria-label="Preferred customer"
              className="mx-auto size-4 text-action"
            />
          ) : (
            '—'
          ),
      }),
      column.accessor('customerNumber', {
        header: 'Customer ID',
        meta: { label: 'Customer ID' },
        cell: function CustomerIdCell({ getValue, row }) {
          const handleView = () => {
            onView(row.original.id);
          };

          return (
            <button
              className="font-medium text-action underline-offset-2 hover:underline"
              onClick={handleView}
              type="button"
            >
              {getValue() ?? '—'}
            </button>
          );
        },
      }),
      column.accessor('name', {
        header: 'Name',
        meta: { label: 'Name' },
        cell: ({ row }) => (
          <DataTableStackedCell
            primary={row.original.displayName ?? row.original.name ?? '—'}
            secondary={row.original.primaryContactName ?? undefined}
            tone="strong"
          />
        ),
      }),
      column.accessor('formattedAddress', {
        header: 'Formatted address',
        meta: { label: 'Formatted address' },
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="line-clamp-2">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('email', {
        header: 'Email',
        meta: { label: 'Email' },
        cell: ({ getValue }) => (
          <span className="truncate">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('phone', {
        header: 'Phone No.',
        meta: { label: 'Phone No.' },
        cell: ({ getValue }) => {
          const raw = getValue();
          if (!raw) return '—';
          return formatLocaleMobile(raw) || raw;
        },
      }),
      column.accessor('tagIds', {
        header: 'Tag',
        enableSorting: false,
        meta: { label: 'Tag' },
        cell: ({ getValue }) => {
          const tagIds = getValue();
          if (!tagIds?.length) return '—';
          return (
            <div className="flex flex-wrap gap-1">
              {tagIds.map((tagId) => (
                <Badge key={tagId} size="sm" tone="info" variant="soft">
                  {formatCustomerTagLabel(tagId, tagsQuery.data)}
                </Badge>
              ))}
            </div>
          );
        },
      }),
      column.display({
        id: 'actions',
        header: 'Action',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Action' },
        cell: function ActionsCell({ row }) {
          if (!canEditCustomer) return '—';

          const handleEdit = () => {
            onEdit(row.original.id);
          };

          return (
            <DataTableRowActions
              editLabel={`Edit ${row.original.displayName ?? row.original.customerNumber ?? 'customer'}`}
              onEdit={handleEdit}
            />
          );
        },
      }),
    ],
    [canEditCustomer, onEdit, onView, tagsQuery.data],
  );

  const items = query.data?.items ?? [];
  const totalCount = query.data?.totalCount ?? 0;
  const tableStatus = query.isPending
    ? 'loading'
    : query.isFetching
      ? 'refetching'
      : query.isError
        ? 'error'
        : 'idle';
  const loadErrorCopy = query.isError
    ? describeCustomerError(query.error)
    : LOAD_CUSTOMERS_ERROR_TITLE;
  const emptyState = globalFilter.trim()
    ? NO_CUSTOMERS_SEARCH
    : NO_CUSTOMERS_FOUND;

  const handleStatusChange = (next: CustomerStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersApply = (filters: CustomerListFilters) => {
    onFiltersApply(filters);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersClear = () => {
    onFiltersClear();
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleClearAllCriteria = () => {
    setGlobalFilter('');
    handleFiltersClear();
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        filter={
          <CustomerListFilter
            appliedFilters={appliedFilters}
            onApply={handleFiltersApply}
            onClear={handleFiltersClear}
          />
        }
        inactiveCount={inactiveCount}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_CUSTOMERS_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />
      <CustomerListCriteriaBar
        appliedFilters={appliedFilters}
        onClearAll={handleClearAllCriteria}
        search={globalFilter}
      />
      <div className="min-h-0 min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="min-h-0 flex-1 rounded-none border-0"
          columns={columns}
          data={items}
          emptyState={emptyState}
          enableColumnResizing
          enableRowSelection={false}
          enableSearch={false}
          errorState={query.isError ? loadErrorCopy : undefined}
          getRowId={(row) => String(row.id)}
          manual={{
            pagination: true,
            sorting: true,
            pageCount: Math.max(1, Math.ceil(totalCount / pagination.pageSize)),
            rowCount: totalCount,
          }}
          onColumnVisibilityChange={onColumnVisibilityChange}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          rowLabel="customers"
          showColumnVisibility
          state={
            {
              columnSizing,
              columnVisibility,
              globalFilter,
              pagination,
              sorting,
            } as unknown as Partial<DataTableState>
          }
          status={tableStatus}
          tableLabel="Customers"
          tableOptions={{ onColumnSizingChange }}
        />
      </div>
    </div>
  );
};
