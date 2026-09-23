import type { UserListSummaryDto } from '@cms/user-contract';
import { MailIcon, MetricCard, SettingsRoleIcon, UsersIcon } from '@cms/ui';
import {
  METRIC_ACROSS_LOCATIONS,
  METRIC_ADMINS,
  METRIC_PENDING_INVITATION,
  METRIC_TOTAL_USERS,
} from '../constant';

export interface UsersSummaryCardsProps {
  loading?: boolean;
  summary: UserListSummaryDto | null | undefined;
}

const formatPercent = (part: number, total: number) => {
  if (total <= 0) return '0% of total';
  const pct = (part / total) * 100;
  return `${pct.toFixed(1)}% of total`;
};

export const UsersSummaryCards = ({
  loading = false,
  summary,
}: UsersSummaryCardsProps) => {
  const totalUsers = summary?.totalUsers ?? 0;
  const pending = summary?.pendingInvitation ?? 0;
  const admins = summary?.admins ?? 0;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        description={METRIC_ACROSS_LOCATIONS}
        icon={<UsersIcon />}
        label={METRIC_TOTAL_USERS}
        loading={loading}
        tone="blue"
        value={totalUsers}
      />
      <MetricCard
        description={formatPercent(pending, totalUsers)}
        icon={<MailIcon />}
        label={METRIC_PENDING_INVITATION}
        loading={loading}
        tone="orange"
        value={pending}
      />
      <MetricCard
        description={formatPercent(admins, totalUsers)}
        icon={<SettingsRoleIcon />}
        label={METRIC_ADMINS}
        loading={loading}
        tone="purple"
        value={admins}
      />
    </div>
  );
};
