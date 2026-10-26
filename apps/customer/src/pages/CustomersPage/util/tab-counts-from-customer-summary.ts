import type { CustomerListSummaryDto } from '@cms/customer-contract';

export const tabCountsFromCustomerSummary = (
  summary: CustomerListSummaryDto | null | undefined,
): { activeCount: number; inactiveCount: number } => {
  if (!summary) {
    return { activeCount: 0, inactiveCount: 0 };
  }
  return {
    activeCount: summary.activeCustomers,
    inactiveCount: summary.inactiveCustomers,
  };
};
