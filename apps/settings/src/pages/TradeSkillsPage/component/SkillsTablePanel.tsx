import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type {
  TechSkillLevelSummaryDto,
  TechTradeSummaryDto,
} from '@cms/settings-contract';
import {
  techSkillLevelListQueryOptions,
  type TechSkillLevelListParams,
} from '@cms/settings-data-access';
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  ADD_SKILL_LABEL,
  LOAD_SKILLS_ERROR_TITLE,
  LOAD_SKILLS_ERROR_TOAST_ID,
} from '../constant';
import type { TradeStatusFilter } from '../types';
import { describeSkillError, uniqueTradeCodesForSkill } from '../util';
import { useCatalogLoadToast } from './use-catalog-load-toast';

const column = createDataTableColumnHelper<TechSkillLevelSummaryDto>();

export interface SkillsTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onDelete: (skill: TechSkillLevelSummaryDto) => void;
  onEdit: (skill: TechSkillLevelSummaryDto) => void;
  queryClient: QueryClient;
  trades: readonly TechTradeSummaryDto[];
}

export const SkillsTablePanel = ({
  activeCount,
  inactiveCount,
  onAdd,
  onDelete,
  onEdit,
  queryClient,
  trades,
}: SkillsTablePanelProps) => {
  const [status, setStatus] = useState<TradeStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'code', desc: false },
  ]);

  const params: TechSkillLevelListParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isActive: status === 'active',
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
  };

  const query = useQuery(techSkillLevelListQueryOptions(params), queryClient);
  useCatalogLoadToast(
    query,
    LOAD_SKILLS_ERROR_TITLE,
    describeSkillError,
    LOAD_SKILLS_ERROR_TOAST_ID,
  );

  const getRowId = (row: TechSkillLevelSummaryDto) => String(row.id);

  const handleStatusChange = (next: TradeStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const columns = useMemo(
    () => [
      column.accessor('code', {
        header: 'Skill Code',
        meta: { label: 'Skill Code' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('name', {
        header: 'Skill Name',
        meta: { label: 'Skill Name' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('description', {
        header: 'Description',
        enableSorting: false,
        meta: { label: 'Description' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.display({
        id: 'associatedTrade',
        header: 'Associated Trade',
        enableSorting: false,
        meta: { label: 'Associated Trade' },
        cell: ({ row }) => uniqueTradeCodesForSkill(row.original.id, trades),
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
              deleteLabel={`Delete ${row.original.name ?? row.original.code ?? 'skill'}`}
              editLabel={`Edit ${row.original.name ?? row.original.code ?? 'skill'}`}
              onDelete={deleteRow}
              onEdit={editRow}
            />
          );
        },
      }),
    ],
    [onDelete, onEdit, trades],
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
        addLabel={ADD_SKILL_LABEL}
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
          tableLabel="Skills"
        />
      </div>
    </div>
  );
};
