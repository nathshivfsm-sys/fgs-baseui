import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customerListQueryOptions } from '@cms/customer-data-access';
import {
  CustomerTablePanel,
  CustomersHeader,
  CustomersSummaryCards,
} from './component';
import type { CustomerListFilters, CustomersPageProps } from './types';
import {
  canEditCustomer,
  emptyCustomerListFilters,
  tabCountsFromCustomerSummary,
} from './util';

export const CustomersPage = ({
  queryClient,
  canEditCustomer: canEditProp,
  currentUser,
}: CustomersPageProps) => {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<CustomerListFilters>(
    emptyCustomerListFilters(),
  );

  const summaryQuery = useQuery(
    customerListQueryOptions({
      page: 1,
      pageSize: 1,
      includeSummary: true,
    }),
    queryClient,
  );

  const { activeCount, inactiveCount } = tabCountsFromCustomerSummary(
    summaryQuery.data?.summary,
  );
  const canEdit = canEditProp ?? canEditCustomer(currentUser);

  const handleAddCustomer = () => {
    navigate('/customers/new');
  };

  const handleViewCustomer = (customerId: number) => {
    navigate(String(customerId));
  };

  const handleEditCustomer = (customerId: number) => {
    navigate(String(customerId));
  };

  const handleFiltersApply = (filters: CustomerListFilters) => {
    setAppliedFilters(filters);
  };

  const handleFiltersClear = () => {
    setAppliedFilters(emptyCustomerListFilters());
  };

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      data-testid="customers-page"
    >
      <CustomersHeader onAdd={handleAddCustomer} />

      <CustomersSummaryCards
        loading={summaryQuery.isPending}
        summary={summaryQuery.data?.summary}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <CustomerTablePanel
          activeCount={activeCount}
          appliedFilters={appliedFilters}
          canEditCustomer={canEdit}
          inactiveCount={inactiveCount}
          onEdit={handleEditCustomer}
          onFiltersApply={handleFiltersApply}
          onFiltersClear={handleFiltersClear}
          onView={handleViewCustomer}
          queryClient={queryClient}
          userId={currentUser.id}
        />
      </div>
    </section>
  );
};
