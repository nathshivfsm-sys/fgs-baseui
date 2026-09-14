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
  Callout,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  type DataTableState,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@cms/ui';
import {
  describePostalCodeError,
  formatTaxRate,
  formatTripCharge,
} from '../util';
import type { ZoneStatusFilter } from '../types';

const column = createDataTableColumnHelper<PostalCodeSummaryDto>();

export interface PostalCodeTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onEdit: (postalCode: PostalCodeSummaryDto) => void;
  queryClient: QueryClient;
}

export function PostalCodeTablePanel({
  activeCount,
  inactiveCount,
  onEdit,
  queryClient,
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
      column.accessor('state', {
        header: 'State',
        meta: { label: 'State' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('zoneName', {
        header: 'Zone',
        enableSorting: false,
        meta: { label: 'Zone' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('taxRate', {
        header: 'Tax Rate',
        enableSorting: false,
        meta: { label: 'Tax Rate' },
        cell: ({ getValue }) => formatTaxRate(getValue()),
      }),
      column.accessor('tripCharge', {
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

  function handleStatusChange(next: string) {
    setStatus(next as ZoneStatusFilter);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <Tabs onValueChange={handleStatusChange} value={status}>
        <TabsList bordered className="px-6">
          <TabsTrigger size="default" tone="action" value="active">
            Active ({activeCount})
          </TabsTrigger>
          <TabsTrigger size="default" tone="action" value="inactive">
            Inactive ({inactiveCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {query.isError ? (
        <div className="p-6">
          <Callout title="Unable to load postal codes" variant="error">
            {describePostalCodeError(query.error)}
          </Callout>
        </div>
      ) : (
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
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            rowLabel="entries"
            showColumnVisibility={false}
            state={{ pagination, sorting }}
            status={tableStatus}
            tableLabel="Postal codes"
          />
        </div>
      )}
    </div>
  );
}
