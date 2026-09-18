import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TaxAuthoritySummaryDto } from '@cms/settings-contract';
import {
  patchTaxAuthorityMutationOptions,
  taxAuthorityListQueryOptions,
  type TaxAuthorityListParams,
} from '@cms/settings-data-access';
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  ASSIGN_AUTHORITY_LABEL,
  LOAD_AUTHORITIES_ERROR_TITLE,
  LOAD_AUTHORITIES_ERROR_TOAST_ID,
  SEARCH_TAX_RATES_PLACEHOLDER,
} from '../constant';
import {
  describeTaxError,
  formatEffectiveDate,
  formatTaxPercent,
} from '../util';
import type { TaxStatusFilter } from '../types';
import { useCatalogLoadToast } from './use-catalog-load-toast';

const column = createDataTableColumnHelper<TaxAuthoritySummaryDto>();

export interface TaxAuthorityTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onEdit: (authority: TaxAuthoritySummaryDto) => void;
  queryClient: QueryClient;
}

export function TaxAuthorityTablePanel({
  activeCount,
  inactiveCount,
  onAdd,
  onEdit,
  queryClient,
}: TaxAuthorityTablePanelProps) {
  const [status, setStatus] = useState<TaxStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'name', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const params: TaxAuthorityListParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isActive: status === 'active',
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
  };

  const query = useQuery(taxAuthorityListQueryOptions(params), queryClient);
  const patchMutation = useMutation(
    patchTaxAuthorityMutationOptions(queryClient),
    queryClient,
  );
  useCatalogLoadToast(
    query,
    LOAD_AUTHORITIES_ERROR_TITLE,
    describeTaxError,
    LOAD_AUTHORITIES_ERROR_TOAST_ID,
  );

  function getRowId(row: TaxAuthoritySummaryDto) {
    return String(row.id);
  }

  function handleToggleActive(authority: TaxAuthoritySummaryDto) {
    patchMutation.mutate({
      id: authority.id,
      body: { isActive: !authority.isActive },
    });
  }

  const columns = useMemo(
    () => [
      column.accessor('name', {
        header: 'Authority',
        meta: { label: 'Authority' },
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('taxPercent', {
        header: 'Rate',
        meta: { label: 'Rate' },
        cell: ({ getValue }) => (
          <span className="font-medium">{formatTaxPercent(getValue())}</span>
        ),
      }),
      column.accessor('description', {
        header: 'Type',
        enableSorting: false,
        meta: { label: 'Type' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('effectiveFromDate', {
        header: 'Effective From',
        meta: { label: 'Effective From' },
        cell: ({ getValue }) => formatEffectiveDate(getValue()),
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
              editLabel={`Edit ${row.original.name ?? row.original.code ?? 'tax authority'}`}
              onEdit={editRow}
            />
          );
        },
      }),
    ],
    [onEdit, patchMutation],
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
        addLabel={ASSIGN_AUTHORITY_LABEL}
        inactiveCount={inactiveCount}
        onAdd={onAdd}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_TAX_RATES_PLACEHOLDER}
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
          manual={{
            pagination: true,
            sorting: true,
            pageCount: Math.max(
              1,
              Math.ceil(totalCount / pagination.pageSize),
            ),
            rowCount: totalCount,
          }}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          rowLabel="entries"
          showColumnVisibility={false}
          state={{ globalFilter, pagination, sorting }}
          status={tableStatus}
          tableLabel="Taxing authorities"
        />
      </div>
    </div>
  );
}
