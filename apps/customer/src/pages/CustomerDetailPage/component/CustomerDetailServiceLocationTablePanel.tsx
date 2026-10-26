import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatLocaleMobile } from '@cms/shared-locale';
import type { ServiceLocationSummaryDto } from '@cms/customer-contract';
import { serviceLocationListQueryOptions } from '@cms/customer-data-access';
import {
  Button,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  InfoCircleIcon,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import type { CatalogStatusFilter } from '../../../shared';
import {
  LOAD_SERVICE_LOCATIONS_ERROR_TITLE,
  NO_SERVICE_LOCATIONS_FILTER,
  NO_SERVICE_LOCATIONS_FOUND,
  NO_SERVICE_LOCATIONS_SEARCH,
  SERVICE_LOCATION_ADD_TOOLBAR_LABEL,
  SERVICE_LOCATION_DEFAULT_PAGE_SIZE,
  SERVICE_LOCATION_SEARCH_PLACEHOLDER,
} from '../constant';
import type { CustomerDetailServiceLocationTablePanelProps } from '../types';
import { describeCatalogError } from '../../../util/describe-catalog-error';
import {
  emptyServiceLocationListFilters,
  toServiceLocationListQueryFilters,
  type ServiceLocationListFilters,
} from '../util';
import { CustomerDetailServiceLocationCriteriaBar } from './CustomerDetailServiceLocationCriteriaBar';
import { CustomerDetailServiceLocationFilter } from './CustomerDetailServiceLocationFilter';

const column = createDataTableColumnHelper<ServiceLocationSummaryDto>();

const describeServiceLocationError = (error: unknown) =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to view these service locations.',
    notFound: 'Service locations could not be found for this customer.',
    conflict: 'Service locations could not be loaded because of a conflict.',
    invalid: 'The service location request was invalid.',
    unreachable: 'The customer service is unavailable.',
    defaultMessage: LOAD_SERVICE_LOCATIONS_ERROR_TITLE,
  });

export const CustomerDetailServiceLocationTablePanel = ({
  customerId,
  onAddLocation,
  onEditLocation,
  onViewLocation,
  queryClient,
}: CustomerDetailServiceLocationTablePanelProps) => {
  const [status, setStatus] = useState<CatalogStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: SERVICE_LOCATION_DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'name', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [appliedFilters, setAppliedFilters] =
    useState<ServiceLocationListFilters>(emptyServiceLocationListFilters());

  const listFilters = toServiceLocationListQueryFilters(appliedFilters);

  const query = useQuery(
    serviceLocationListQueryOptions(customerId, {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortBy: sorting[0]?.id,
      sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
      search: globalFilter.trim() || undefined,
      isActive: status === 'active',
      includeSummary: true,
      ...listFilters,
    }),
    queryClient,
  );

  const summary = query.data?.summary;
  const activeCount = summary?.activeCount ?? 0;
  const inactiveCount = summary?.inactiveCount ?? 0;

  const columns = useMemo(
    () => [
      column.accessor('locationNumber', {
        id: 'locationNumber',
        header: '#ID',
        meta: { label: '#ID' },
        cell: function LocationIdCell({ getValue, row }) {
          const handleView = () => {
            onViewLocation(row.original.id);
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
        cell: ({ getValue }) => (
          <span className="font-semibold text-[#2e323c]">
            {getValue() ?? '—'}
          </span>
        ),
      }),
      column.accessor('displayName', {
        header: 'Display Name',
        meta: { label: 'Display Name' },
        cell: ({ getValue }) => (
          <span className="capitalize">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('formattedAddress', {
        id: 'formattedAddress',
        header: 'Address',
        meta: { label: 'Address' },
        cell: ({ getValue }) => (
          <span
            className="line-clamp-2 capitalize"
            title={getValue() ?? undefined}
          >
            {getValue() ?? '—'}
          </span>
        ),
      }),
      column.accessor('email', {
        header: 'Email',
        enableSorting: false,
        meta: { label: 'Email' },
        cell: ({ getValue }) => (
          <span className="truncate lowercase">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('phone', {
        id: 'phone',
        header: 'Phone no.',
        meta: { label: 'Phone no.' },
        cell: ({ getValue }) => {
          const raw = getValue();
          if (!raw) return '—';
          return formatLocaleMobile(raw) || raw;
        },
      }),
      column.display({
        id: 'actions',
        header: 'Action',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Action' },
        cell: function ActionsCell({ row }) {
          const handleEdit = () => {
            onEditLocation(row.original.id);
          };

          const handleView = () => {
            onViewLocation(row.original.id);
          };

          return (
            <div className="flex items-center justify-center gap-2">
              <DataTableRowActions
                editLabel={`Edit ${row.original.name ?? 'service location'}`}
                onEdit={handleEdit}
              />
              <Button
                aria-label={`View ${row.original.name ?? 'service location'}`}
                className="size-7 border-input bg-surface p-0 text-foreground"
                onClick={handleView}
                title="View service location"
                type="button"
                variant="outline"
              >
                <InfoCircleIcon className="size-3.5" />
              </Button>
            </div>
          );
        },
      }),
    ],
    [onEditLocation, onViewLocation],
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
    ? describeServiceLocationError(query.error)
    : LOAD_SERVICE_LOCATIONS_ERROR_TITLE;

  const hasSearch = Boolean(globalFilter.trim());
  const hasFilter = Boolean(appliedFilters.customerType);
  const emptyState = hasSearch
    ? NO_SERVICE_LOCATIONS_SEARCH
    : hasFilter
      ? NO_SERVICE_LOCATIONS_FILTER
      : status === 'active'
        ? 'No active service locations.'
        : 'No inactive service locations.';

  const handleStatusChange = (next: CatalogStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersApply = (filters: ServiceLocationListFilters) => {
    setAppliedFilters(filters);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersClear = () => {
    setAppliedFilters(emptyServiceLocationListFilters());
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleClearAllCriteria = () => {
    setGlobalFilter('');
    handleFiltersClear();
  };

  const handleAddLocation = () => {
    onAddLocation();
  };

  return (
    <div
      className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-surface shadow-[4px_4px_64px_16px_rgba(0,0,0,0.02)]"
      data-testid="customer-service-locations-table"
    >
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={SERVICE_LOCATION_ADD_TOOLBAR_LABEL}
        filter={
          <CustomerDetailServiceLocationFilter
            appliedFilters={appliedFilters}
            onApply={handleFiltersApply}
            onClear={handleFiltersClear}
          />
        }
        inactiveCount={inactiveCount}
        onAdd={handleAddLocation}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SERVICE_LOCATION_SEARCH_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />
      <CustomerDetailServiceLocationCriteriaBar
        appliedFilters={appliedFilters}
        onClearAll={handleClearAllCriteria}
        search={globalFilter}
      />
      <div className="min-h-0 min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="min-h-0 flex-1 rounded-none border-0 [&_thead]:bg-[#fafaff] [&_thead_th]:text-[13px] [&_thead_th]:font-medium [&_thead_th]:capitalize [&_thead_th]:text-[#1f54c8]"
          columns={columns}
          data={items}
          emptyState={emptyState}
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
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          rowLabel="locations"
          state={
            {
              globalFilter,
              pagination,
              sorting,
            } as unknown as Partial<DataTableState>
          }
          status={tableStatus}
          tableLabel="Service locations"
        />
      </div>
    </div>
  );
};
