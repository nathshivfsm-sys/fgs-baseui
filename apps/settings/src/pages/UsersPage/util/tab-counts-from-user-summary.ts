import type { UserListSummaryDto } from '@cms/user-contract';

/**
 * Tab badges match `isActive` filters on GET `/user`. Summary is loaded without
 * `isActive`, so active users = total − inactive (same as MSW `listSummary`).
 */
export const tabCountsFromUserSummary = (
  summary: UserListSummaryDto | null | undefined,
): { activeCount: number; inactiveCount: number } => {
  if (!summary) {
    return { activeCount: 0, inactiveCount: 0 };
  }
  const inactiveCount = summary.inactive;
  const activeCount = Math.max(0, summary.totalUsers - inactiveCount);
  return { activeCount, inactiveCount };
};
