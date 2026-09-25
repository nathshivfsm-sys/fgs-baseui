import { MetricCard, SettingsRoleIcon, UsersIcon } from '@cms/ui';
import {
  METRIC_ACROSS_LOCATIONS,
  METRIC_ADMINS,
  METRIC_TOTAL_EMPLOYEES,
} from '../constant';
import type { EmployeesSummaryCardsProps } from '../types';
import { formatPercentOfTotal } from '../util';

export const EmployeesSummaryCards = ({
  admins,
  loading = false,
  totalEmployees,
}: EmployeesSummaryCardsProps) => (
  <div className="grid gap-3 sm:grid-cols-2">
    <MetricCard
      description={METRIC_ACROSS_LOCATIONS}
      icon={<UsersIcon />}
      label={METRIC_TOTAL_EMPLOYEES}
      loading={loading}
      tone="blue"
      value={totalEmployees}
    />
    <MetricCard
      description={formatPercentOfTotal(admins, totalEmployees)}
      icon={<SettingsRoleIcon />}
      label={METRIC_ADMINS}
      loading={loading}
      tone="green"
      value={admins}
    />
  </div>
);
