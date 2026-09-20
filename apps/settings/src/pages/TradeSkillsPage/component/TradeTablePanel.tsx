import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { TechTradeSummaryDto } from '@cms/settings-contract';
import {
  techTradeListQueryOptions,
  type TechTradeListParams,
} from '@cms/settings-data-access';
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  ADD_TRADE_LABEL,
  LOAD_TRADES_ERROR_TITLE,
  LOAD_TRADES_ERROR_TOAST_ID,
} from '../constant';
import type { TradeStatusFilter } from '../types';
import { describeTradeError, joinLabelsByIds } from '../util';
import { useCatalogLoadToast } from './use-catalog-load-toast';

const column = createDataTableColumnHelper<TechTradeSummaryDto>();

export interface TradeTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onDelete: (trade: TechTradeSummaryDto) => void;
  onEdit: (trade: TechTradeSummaryDto) => void;
  queryClient: QueryClient;
  skillLabelsById: ReadonlyMap<number, string>;
}

export const TradeTablePanel = ({
  activeCount,
  inactiveCount,
  onAdd,
  onDelete,
  onEdit,
  queryClient,
  skillLabelsById,
}: TradeTablePanelProps) => {
  const [status, setStatus] = useState<TradeStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'tradeCode', desc: false },
  ]);

  const params: TechTradeListParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isActive: status === 'active',
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
  };

  const query = useQuery(techTradeListQueryOptions(params), queryClient);
  useCatalogLoadToast(
    query,
    LOAD_TRADES_ERROR_TITLE,
    describeTradeError,
    LOAD_TRADES_ERROR_TOAST_ID,
  );

  const getRowId = (row: TechTradeSummaryDto) => String(row.id);

  const handleStatusChange = (next: TradeStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const columns = useMemo(
    () => [
      column.accessor('tradeCode', {
        header: 'Trade Code',
        meta: { label: 'Trade Code' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('name', {
        header: 'Trade Name',
        meta: { label: 'Trade Name' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('description', {
        header: 'Description',
        enableSorting: false,
        meta: { label: 'Description' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.display({
        id: 'associatedSkill',
        header: 'Associated Skill',
        enableSorting: false,
        meta: { label: 'Associated Skill' },
        cell: ({ row }) => joinLabelsByIds(row.original.skillIds, skillLabelsById),
      }),
      column.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Actions' },
        cell: function ActionsCell({ row }) {
          const editRow = () => {
            onEdit(row.original);
          };
          const deleteRow = () => {
            onDelete(row.original);
          };

          return (
            <DataTableRowActions
              deleteLabel={`Delete ${row.original.name ?? row.original.tradeCode ?? 'trade'}`}
              editLabel={`Edit ${row.original.name ?? row.original.tradeCode ?? 'trade'}`}
              onDelete={deleteRow}
              onEdit={editRow}
            />
          );
        },
      }),
    ],
    [onDelete, onEdit, skillLabelsById],
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

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_TRADE_LABEL}
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
          tableLabel="Trades"
        />
      </div>
    </div>
  );
};
