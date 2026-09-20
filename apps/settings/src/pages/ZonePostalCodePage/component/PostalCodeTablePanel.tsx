import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { PostalCodeSummaryDto } from '@cms/settings-contract';
import {
  patchPostalCodeMutationOptions,
  postalCodeListQueryOptions,
  type PostalCodeListParams,
} from '@cms/settings-data-access';
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  type DataTableState,
} from '@cms/ui';
import {
  ADD_POSTAL_LABEL,
  LOAD_POSTAL_ERROR_TITLE,
  LOAD_POSTAL_ERROR_TOAST_ID,
} from '../constant';
import {
  describePostalCodeError,
  formatTaxRate,
  formatTripCharge,
  labelForId,
} from '../util';
import type { ZoneStatusFilter } from '../types';
import { CatalogStatusTabBar } from '../../../shared';
import { useCatalogLoadToast } from './use-catalog-load-toast';

const column = createDataTableColumnHelper<PostalCodeSummaryDto>();

export interface PostalCodeTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onEdit: (postalCode: PostalCodeSummaryDto) => void;
  queryClient: QueryClient;
  taxRatesById: ReadonlyMap<number, number>;
  zoneLabelsById: ReadonlyMap<number, string>;
}

export function PostalCodeTablePanel({
  activeCount,
  inactiveCount,
  onAdd,
  onEdit,
  queryClient,
  taxRatesById,
  zoneLabelsById,
}: PostalCodeTablePanelProps) {
  const [status, setStatus] = useState<ZoneStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'postalCode', desc: false },
  ]);

  const params: PostalCodeListParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isActive: status === 'active',
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
  };

  const query = useQuery(postalCodeListQueryOptions(params), queryClient);
  const patchMutation = useMutation(
    patchPostalCodeMutationOptions(queryClient),
    queryClient,
  );
  useCatalogLoadToast(
    query,
    LOAD_POSTAL_ERROR_TITLE,
    describePostalCodeError,
    LOAD_POSTAL_ERROR_TOAST_ID,
  );

  function getRowId(row: PostalCodeSummaryDto) {
    return String(row.id);
  }

  function handleToggleActive(postalCode: PostalCodeSummaryDto) {
    patchMutation.mutate({
      id: postalCode.id,
      body: { isActive: !postalCode.isActive },
    });
  }

  const columns = useMemo(
    () => [
      column.accessor('postalCode', {
        header: 'Postal Code',
        meta: { label: 'Postal Code' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('city', {
        header: 'City',
        meta: { label: 'City' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('stateProvinceCode', {
        header: 'State',
        meta: { label: 'State' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.display({
        id: 'zone',
        header: 'Zone',
        enableSorting: false,
        meta: { label: 'Zone' },
        cell: ({ row }) =>
          labelForId(row.original.fgsSetupZoneId, zoneLabelsById),
      }),
      column.display({
        id: 'taxRate',
        header: 'Tax Rate',
        enableSorting: false,
        meta: { label: 'Tax Rate' },
        cell: ({ row }) => {
          const taxId = row.original.fgsSetupTaxId;
          return formatTaxRate(
            taxId == null ? undefined : taxRatesById.get(taxId),
          );
        },
      }),
      column.accessor('tripChargeAmount', {
        header: 'Trip Charge',
        enableSorting: false,
        meta: { label: 'Trip Charge' },
        cell: ({ getValue }) => formatTripCharge(getValue()),
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
              editLabel={`Edit ${row.original.postalCode ?? 'postal code'}`}
              onEdit={editRow}
            />
          );
        },
      }),
    ],
    [onEdit, patchMutation, taxRatesById, zoneLabelsById],
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

  function handleStatusChange(next: ZoneStatusFilter) {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_POSTAL_LABEL}
        inactiveCount={inactiveCount}
        onAdd={onAdd}
        onStatusChange={handleStatusChange}
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
            pageCount: Math.max(1, Math.ceil(totalCount / pagination.pageSize)),
            rowCount: totalCount,
          }}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          rowLabel="entries"
          showColumnVisibility={false}
          state={{ pagination, sorting }}
          status={tableStatus}
          tableLabel="Postal codes"
        />
      </div>
    </div>
  );
}
