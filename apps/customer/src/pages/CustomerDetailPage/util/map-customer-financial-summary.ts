import type { CustomerFinancialSummaryDto } from '@cms/customer-contract';
import type { CustomerDetailFinancialSnapshot } from '../types';

export const mapCustomerFinancialSummary = (
  summary: CustomerFinancialSummaryDto | undefined,
): CustomerDetailFinancialSnapshot => {
  if (!summary) {
    return {
      arBalance: null,
      activeCards: null,
      scheduledPayments: null,
      totalSales: null,
    };
  }

  return {
    arBalance: summary.arBalance,
    totalSales: summary.totalSales,
    activeCards: summary.activeCardsOnFile,
    scheduledPayments: summary.scheduledPaymentsCount,
  };
};
