import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { formatLocaleMobile } from '@cms/shared-locale';
import type { EmployeeSummaryDto } from '@cms/settings-contract';
import {
  employeeListQueryOptions,
  patchEmployeeMutationOptions,
  type EmployeeListParams,
} from '@cms/settings-data-access';
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  ADD_EMPLOYEE_LABEL,
  LOAD_EMPLOYEES_ERROR_TITLE,
  LOAD_EMPLOYEES_ERROR_TOAST_ID,
  NO_EMPLOYEES_FOUND,
  SEARCH_EMPLOYEES_PLACEHOLDER,
} from '../constant';
import type { EmployeeStatusFilter, EmployeeTablePanelProps } from '../types';
import {
  describeEmployeeError,
  employeeListEmail,
  employeeListPhone,
  formatEmployeeLastLogin,
  formatExternalName,
} from '../util';
import { EmployeeListAvatar } from './EmployeeListAvatar';
import { EmployeeListRoleFilter } from './EmployeeListRoleFilter';
import { EmployeeRoleBadge } from './EmployeeRoleBadge';
import { useEmployeeListLoadToast } from './use-employee-list-load-toast';

const column = createDataTableColumnHelper<EmployeeSummaryDto>();

export const EmployeeTablePanel = ({
  activeCount,
  inactiveCount,
  onAdd,
  onEdit,
  queryClient,
  roles,
}: EmployeeTablePanelProps) => {
  const [status, setStatus] = useState<EmployeeStatusFilter>('active');
  const [appliedRoleIds, setAppliedRoleIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'displayName', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const params: EmployeeListParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isActive: status === 'active',
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
    search: globalFilter.trim() || undefined,
    roleIds:
      appliedRoleIds.length > 0
        ? appliedRoleIds.map((id) => Number(id))
        : undefined,
  };

  const query = useQuery(employeeListQueryOptions(params), queryClient);
  const patchMutation = useMutation(
    patchEmployeeMutationOptions(queryClient),
    queryClient,
  );
  useEmployeeListLoadToast(
    query,
    LOAD_EMPLOYEES_ERROR_TITLE,
    describeEmployeeError,
    LOAD_EMPLOYEES_ERROR_TOAST_ID,
  );

  const columns = useMemo(
    () => [
      column.accessor('displayName', {
        header: 'Employee',
        meta: { label: 'Employee' },
        cell: ({ getValue, row }) => (
          <div className="flex min-w-0 items-center gap-2.5">
            <EmployeeListAvatar
              displayName={getValue()}
              employeeId={row.original.id}
            />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-control font-semibold text-action">
                {getValue() ?? '—'}
              </span>
              <span className="truncate text-caption text-foreground-subtle">
                {row.original.employeeNumber ?? '—'}
              </span>
            </span>
          </div>
        ),
      }),
      column.accessor(
        (row) => formatExternalName(row.legalFirstName, row.legalLastName),
        {
          id: 'legalLastName',
          header: 'External Name',
          meta: { label: 'External Name' },
          cell: ({ row }) =>
            formatExternalName(
              row.original.legalFirstName,
              row.original.legalLastName,
            ),
        },
      ),
      column.accessor('roleName', {
        header: 'Role',
        meta: { label: 'Role' },
        cell: ({ getValue }) => <EmployeeRoleBadge roleName={getValue()} />,
      }),
      column.accessor((row) => employeeListEmail(row) ?? '', {
        id: 'officeEmail',
        header: 'Email',
        meta: { label: 'Email' },
        cell: ({ row }) => (
          <span className="truncate">
            {employeeListEmail(row.original) ?? '—'}
          </span>
        ),
      }),
      column.accessor((row) => employeeListPhone(row) ?? '', {
        id: 'personalPhone',
        header: 'Phone',
        meta: { label: 'Phone' },
        cell: ({ row }) => {
          const raw = employeeListPhone(row.original);
          if (!raw) return '—';
          return formatLocaleMobile(raw) || raw;
        },
      }),
      column.accessor('lastLoginOn', {
        header: 'Last Login',
        meta: { label: 'Last Login' },
        cell: ({ getValue }) => formatEmployeeLastLogin(getValue()),
      }),
      column.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Actions' },
        cell: function ActionsCell({ row }) {
          const isActiveTab = status === 'active';

          const handleToggle = () => {
            patchMutation.mutate({
              id: row.original.id,
              body: { isActive: !isActiveTab },
            });
          };

          const handleEdit = () => {
            onEdit(row.original);
          };

          return (
            <DataTableRowActions
              actions={[
                {
                  label: isActiveTab ? 'Deactivate' : 'Activate',
                  onSelect: handleToggle,
                },
              ]}
              editLabel={`Edit ${row.original.displayName ?? 'employee'}`}
              onEdit={handleEdit}
            />
          );
        },
      }),
    ],
    [onEdit, patchMutation, status],
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

  const handleStatusChange = (next: EmployeeStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleRoleFilterApply = (roleIds: readonly string[]) => {
    setAppliedRoleIds([...roleIds]);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleRoleFilterClear = () => {
    setAppliedRoleIds([]);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_EMPLOYEE_LABEL}
        filter={
          <EmployeeListRoleFilter
            appliedRoleIds={appliedRoleIds}
            onApply={handleRoleFilterApply}
            onClear={handleRoleFilterClear}
            roles={roles}
          />
        }
        inactiveCount={inactiveCount}
        onAdd={onAdd}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_EMPLOYEES_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />

      <div className="min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="rounded-none border-0"
          columns={columns}
          data={items}
          emptyState={NO_EMPLOYEES_FOUND}
          enableRowSelection={false}
          enableSearch={false}
          getRowId={(row) => String(row.id)}
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
          rowLabel="employees"
          showColumnVisibility={false}
          state={{ globalFilter, pagination, sorting }}
          status={tableStatus}
          tableLabel="Employees"
        />
      </div>
    </div>
  );
};
