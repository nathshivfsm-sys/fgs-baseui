import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { formatLocaleMobile } from '@cms/shared-locale';
import type { UserSummaryDto } from '@cms/user-contract';
import {
  patchUserMutationOptions,
  userListQueryOptions,
  type UserListParams,
} from '@cms/user-data-access';
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  ADD_USER_LABEL,
  LOAD_USERS_ERROR_TITLE,
  LOAD_USERS_ERROR_TOAST_ID,
  SEARCH_USERS_PLACEHOLDER,
} from '../constant';
import type { UserStatusFilter } from '../types';
import { describeUserError, formatUserLastLogin } from '../util';
import { useUserListLoadToast } from './use-user-list-load-toast';
import { UserListAvatar } from './UserListAvatar';
import { UserRoleBadge } from './UserRoleBadge';

const column = createDataTableColumnHelper<UserSummaryDto>();

export interface UserTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onEdit: (user: UserSummaryDto) => void;
  queryClient: QueryClient;
}

export const UserTablePanel = ({
  activeCount,
  inactiveCount,
  onAdd,
  onEdit,
  queryClient,
}: UserTablePanelProps) => {
  const [status, setStatus] = useState<UserStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'displayName', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const params: UserListParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isActive: status === 'active',
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
    search: globalFilter.trim() || undefined,
  };

  const query = useQuery(userListQueryOptions(params), queryClient);
  const patchMutation = useMutation(
    patchUserMutationOptions(queryClient),
    queryClient,
  );
  useUserListLoadToast(
    query,
    LOAD_USERS_ERROR_TITLE,
    describeUserError,
    LOAD_USERS_ERROR_TOAST_ID,
  );

  const columns = useMemo(
    () => [
      column.accessor('displayName', {
        header: 'Name',
        meta: { label: 'Name' },
        cell: ({ getValue, row }) => (
          <div className="flex min-w-0 items-center gap-2.5">
            <UserListAvatar
              displayName={getValue()}
              userId={row.original.id}
            />
            <span className="truncate text-control font-semibold text-action">
              {getValue() ?? '—'}
            </span>
          </div>
        ),
      }),
      column.accessor('roleName', {
        header: 'Role',
        meta: { label: 'Role' },
        cell: ({ getValue }) => <UserRoleBadge roleName={getValue()} />,
      }),
      column.accessor('email', {
        header: 'Email',
        meta: { label: 'Email' },
        cell: ({ getValue }) => (
          <span className="truncate">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('phoneNumber', {
        header: 'Phone',
        meta: { label: 'Phone' },
        cell: ({ getValue }) => {
          const raw = getValue();
          if (!raw) return '—';
          return formatLocaleMobile(raw) || raw;
        },
      }),
      column.accessor('lastLoginOn', {
        header: 'Last Login',
        meta: { label: 'Last Login' },
        cell: ({ getValue }) => formatUserLastLogin(getValue()),
      }),
      column.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Actions' },
        cell: function ActionsCell({ row }) {
          const handleToggle = () => {
            patchMutation.mutate({
              id: row.original.id,
              body: { isActive: !row.original.isActive },
            });
          };

          const handleEdit = () => {
            onEdit(row.original);
          };

          return (
            <DataTableRowActions
              actions={[
                {
                  label: row.original.isActive ? 'Deactivate' : 'Activate',
                  onSelect: handleToggle,
                },
              ]}
              editLabel={`Edit ${row.original.displayName ?? 'user'}`}
              onEdit={handleEdit}
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

  const handleStatusChange = (next: UserStatusFilter) => {
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
        addLabel={ADD_USER_LABEL}
        inactiveCount={inactiveCount}
        onAdd={onAdd}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_USERS_PLACEHOLDER}
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
          getRowId={(row) => row.id}
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
          rowLabel="users"
          showColumnVisibility={false}
          state={{ globalFilter, pagination, sorting }}
          status={tableStatus}
          tableLabel="Users"
        />
      </div>
    </div>
  );
};
