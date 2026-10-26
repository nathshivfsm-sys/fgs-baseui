import { cn, DollarCircleIcon, GrowthArrowIcon, PaymentIcon } from '@cms/ui';
import { formatLocaleCurrency } from '@cms/shared-locale';
import type { CustomerDetailOverviewProps } from '../types';
import { CustomerDetailBasicDetailsCard } from './CustomerDetailBasicDetailsCard';
import { CustomerDetailMetricTile } from './CustomerDetailMetricTile';

const formatMetricCurrency = (amount: number | null) =>
  amount == null ? '—' : formatLocaleCurrency(amount);

const formatMetricCount = (count: number | null) =>
  count == null ? '—' : count.toLocaleString();

export const CustomerDetailOverview = ({
  customer,
  detailsLoading = false,
  financials,
  metricsLoading = false,
  paymentTermLabel,
}: CustomerDetailOverviewProps) => {
  if (!customer && !detailsLoading) return null;

  const metricTiles = (
    <>
      <CustomerDetailMetricTile
        caption="Outstanding balance"
        icon={<DollarCircleIcon />}
        label="AR Balance"
        loading={metricsLoading}
        tone="blue"
        value={formatMetricCurrency(financials.arBalance)}
      />
      <CustomerDetailMetricTile
        caption="All Time"
        icon={<GrowthArrowIcon />}
        label="Total Sales"
        loading={metricsLoading}
        tone="purple"
        value={formatMetricCurrency(financials.totalSales)}
      />
      <CustomerDetailMetricTile
        caption="Card On File"
        icon={<PaymentIcon />}
        label="Active Cards"
        loading={metricsLoading}
        tone="blue"
        value={formatMetricCount(financials.activeCards)}
      />
      <CustomerDetailMetricTile
        caption="Upcoming"
        icon={<GrowthArrowIcon />}
        label="Scheduled Payments"
        loading={metricsLoading}
        tone="purple"
        value={formatMetricCount(financials.scheduledPayments)}
      />
    </>
  );

  const basicDetailsCard = (
    <CustomerDetailBasicDetailsCard
      customer={customer}
      loading={detailsLoading}
      paymentTermLabel={paymentTermLabel}
    />
  );

  return (
    <>
      <div
        className={cn(
          'flex w-full min-w-0 flex-col gap-1.5 min-[1441px]:hidden',
          'sm:flex-row sm:items-stretch',
        )}
      >
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-1.5">
          {metricTiles}
        </div>
        <div className="min-w-0 sm:flex-[1.35]">{basicDetailsCard}</div>
      </div>
      <div
        className={cn(
          'hidden w-full min-w-0 gap-1.5 min-[1441px]:grid',
          'min-[1441px]:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.35fr)]',
        )}
      >
        {metricTiles}
        <div className="min-[1441px]:col-start-5 min-[1441px]:row-start-1">
          {basicDetailsCard}
        </div>
      </div>
    </>
  );
};
