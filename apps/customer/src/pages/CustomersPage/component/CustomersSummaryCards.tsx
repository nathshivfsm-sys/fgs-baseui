import { MetricCard, ReportIcon, UsersIcon } from '@cms/ui';
import {
  METRIC_ALL_TIME,
  METRIC_NEW_THIS_MONTH,
  METRIC_TOTAL_CUSTOMERS,
  METRIC_VS_LAST_MONTH,
} from '../constant';
import type { CustomersSummaryCardsProps } from '../types';

const formatPercentChange = (value: number | null | undefined) => {
  if (value == null) return METRIC_VS_LAST_MONTH;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}% ${METRIC_VS_LAST_MONTH}`;
};

export const CustomersSummaryCards = ({
  loading = false,
  summary,
}: CustomersSummaryCardsProps) => {
  const totalCustomers = summary?.totalCustomers ?? 0;
  const newThisMonth = summary?.newThisMonth ?? 0;
  const percentChange = summary?.newCustomerPercentChange;
  const descriptionTone =
    percentChange == null
      ? 'default'
      : percentChange >= 0
        ? 'positive'
        : 'negative';

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:max-w-3xl">
      <MetricCard
        description={METRIC_ALL_TIME}
        icon={<UsersIcon />}
        label={METRIC_TOTAL_CUSTOMERS}
        loading={loading}
        tone="blue"
        value={totalCustomers.toLocaleString()}
      />
      <MetricCard
        description={formatPercentChange(percentChange)}
        descriptionTone={descriptionTone}
        icon={<ReportIcon />}
        label={METRIC_NEW_THIS_MONTH}
        loading={loading}
        tone="purple"
        value={newThisMonth.toLocaleString()}
      />
    </div>
  );
};
