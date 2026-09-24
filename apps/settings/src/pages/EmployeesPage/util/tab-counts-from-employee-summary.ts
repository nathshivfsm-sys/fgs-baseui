import type { EmployeeListSummaryDto } from '@cms/settings-contract';

export const tabCountsFromEmployeeSummary = (
  summary: EmployeeListSummaryDto | null | undefined,
): { activeCount: number; inactiveCount: number } => {
  if (!summary) {
    return { activeCount: 0, inactiveCount: 0 };
  }
  return {
    activeCount: summary.activeEmployees,
    inactiveCount: summary.inactiveEmployees,
  };
};

export const formatPercentOfTotal = (part: number, total: number): string => {
  if (total <= 0) return '0% of total';
  const pct = (part / total) * 100;
  return `${pct.toFixed(1)}% of total`;
};
