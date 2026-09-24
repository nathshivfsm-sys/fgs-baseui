import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { EmployeeSummaryDto } from '@cms/settings-contract';
import { employeeListQueryOptions } from '@cms/settings-data-access';
import { roleLookupQueryOptions } from '@cms/user-data-access';
import {
  EmployeeTablePanel,
  EmployeesHeader,
  EmployeesSummaryCards,
} from './component';
import type { EmployeesPageProps } from './types';
import { isAdminRole, tabCountsFromEmployeeSummary } from './util';

export const EmployeesPage = ({ queryClient }: EmployeesPageProps) => {
  const rolesQuery = useQuery(roleLookupQueryOptions(true), queryClient);
  const summaryQuery = useQuery(
    employeeListQueryOptions({
      page: 1,
      pageSize: 1,
      includeSummary: true,
    }),
    queryClient,
  );

  const adminRoleIds = useMemo(
    () =>
      (rolesQuery.data ?? [])
        .filter((role) => isAdminRole(role))
        .map((role) => role.id),
    [rolesQuery.data],
  );

  const adminsQuery = useQuery(
    {
      ...employeeListQueryOptions({
        page: 1,
        pageSize: 1,
        includeSummary: false,
        roleIds: adminRoleIds,
      }),
      enabled: adminRoleIds.length > 0,
    },
    queryClient,
  );

  const { activeCount, inactiveCount } = tabCountsFromEmployeeSummary(
    summaryQuery.data?.summary,
  );
  const totalEmployees = summaryQuery.data?.summary?.totalEmployees ?? 0;
  const admins = adminRoleIds.length > 0 ? (adminsQuery.data?.totalCount ?? 0) : 0;

  const handleAddEmployee = () => {
    return;
  };

  const handleEditEmployee = (_employee: EmployeeSummaryDto) => {
    return;
  };

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="employees-page"
    >
      <EmployeesHeader />

      <EmployeesSummaryCards
        admins={admins}
        loading={
          summaryQuery.isPending ||
          rolesQuery.isPending ||
          (adminRoleIds.length > 0 && adminsQuery.isPending)
        }
        totalEmployees={totalEmployees}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <EmployeeTablePanel
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          onAdd={handleAddEmployee}
          onEdit={handleEditEmployee}
          queryClient={queryClient}
          roles={rolesQuery.data}
        />
      </div>
    </section>
  );
};
