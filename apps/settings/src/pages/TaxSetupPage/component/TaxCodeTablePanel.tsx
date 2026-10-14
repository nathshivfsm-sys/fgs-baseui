import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TaxSummaryDto } from '@cms/settings-contract';
import {
  patchTaxMutationOptions,
  taxListQueryOptions,
} from '@cms/settings-data-access';
import {
  Badge,
  buildDataTableListRequest,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  resolveDataTableRows,
  type DataTableDataMode,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  ADD_TAX_CODE_LABEL,
  LOAD_TAX_CODES_ERROR_TITLE,
  LOAD_TAX_CODES_ERROR_TOAST_ID,
  SEARCH_TAX_CODES_PLACEHOLDER,
} from '../constant';
import { describeTaxError, formatTaxPercent } from '../util';
import type { TaxStatusFilter } from '../types';
import { useCatalogLoadToast } from './use-catalog-load-toast';

const column = createDataTableColumnHelper<TaxSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export interface TaxCodeTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onEdit: (tax: TaxSummaryDto) => void;
  queryClient: QueryClient;
}

export function TaxCodeTablePanel({
  activeCount,
  inactiveCount,
  onAdd,
  onEdit,
  queryClient,
}: TaxCodeTablePanelProps) {
  const [status, setStatus] = useState<TaxStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'name', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const listRequest = buildDataTableListRequest({
    mode: LIST_DATA_MODE,
    pagination,
    sorting,
    globalFilter,
    serverManual: { sorting: true },
  });

  const query = useQuery(
    taxListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
    }),
    queryClient,
  );
  const patchMutation = useMutation(
    patchTaxMutationOptions(queryClient),
    queryClient,
  );
  useCatalogLoadToast(
    query,
    LOAD_TAX_CODES_ERROR_TITLE,
    describeTaxError,
    LOAD_TAX_CODES_ERROR_TOAST_ID,
  );

  function getRowId(row: TaxSummaryDto) {
    return String(row.id);
  }

  function handleToggleActive(tax: TaxSummaryDto) {
    patchMutation.mutate({
      id: tax.id,
      body: { isActive: !tax.isActive },
    });
  }

  const columns = useMemo(
    () => [
      column.accessor('name', {
        header: 'Tax Name',
        meta: { label: 'Tax Name' },
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('taxRate', {
        header: 'Rate',
        meta: { label: 'Rate' },
        cell: ({ getValue }) => (
          <span className="font-medium">{formatTaxPercent(getValue())}</span>
        ),
      }),
      column.accessor('regionCode', {
        header: 'State / Province',
        meta: { label: 'State / Province' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('county', {
        header: 'County',
        meta: { label: 'County' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('city', {
        header: 'City',
        meta: { label: 'City' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('isActive', {
        header: 'Status',
        enableSorting: false,
        meta: { label: 'Status' },
        cell: ({ getValue }) => (
          <Badge
            size="sm"
            tone={getValue() ? 'success' : 'neutral'}
            variant="soft"
          >
            {getValue() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      }),
      column.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Actions' },
        cell: function ActionsCell({ row }) {
          function toggleActive() {
            handleToggleActive(row.original);
          }

          function editRow() {
            onEdit(row.original);
          }

          return (
            <DataTableRowActions
              actions={[
                {
                  label: row.original.isActive ? 'Deactivate' : 'Activate',
                  onSelect: toggleActive,
                },
              ]}
              editLabel={`Edit ${row.original.taxCode ?? row.original.name ?? 'tax code'}`}
              onEdit={editRow}
            />
          );
        },
      }),
    ],
    [onEdit, patchMutation],
  );

  const { rows: items, manual } = resolveDataTableRows({
    mode: LIST_DATA_MODE,
    pagination,
    items: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    serverManual: { sorting: true },
  });

  const tableStatus = query.isPending
    ? 'loading'
    : query.isFetching
      ? 'refetching'
      : query.isError
        ? 'error'
        : 'idle';

  const handleStatusChange = (next: TaxStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_TAX_CODE_LABEL}
        inactiveCount={inactiveCount}
        onAdd={onAdd}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_TAX_CODES_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />

      <div className="min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="rounded-none border-0"
          columns={columns}
          data={items}
          enableRowSelection={false}
          enableSearch={false}
          getRowId={getRowId}
          manual={manual}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          rowLabel="entries"
          showColumnVisibility={false}
          state={{ globalFilter, pagination, sorting }}
          status={tableStatus}
          tableLabel="Tax codes"
        />
      </div>
    </div>
  );
}
