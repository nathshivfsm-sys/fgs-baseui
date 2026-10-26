import { Badge, cn } from '@cms/ui';
import type { CustomerDetailStickyOverviewProps } from '../types';
import { CustomerDetailBreadcrumb } from './CustomerDetailBreadcrumb';
import { CustomerDetailOverview } from './CustomerDetailOverview';
import { CustomerDetailSectionNav } from './CustomerDetailSectionNav';
import { CustomerDetailSummaryHeader } from './CustomerDetailSummaryHeader';

export const CustomerDetailStickyOverview = ({
  activeSectionId,
  customer,
  detailsLoading = false,
  financials,
  metricsLoading = false,
  onCreateNewLocation,
  onDeactivateCustomer,
  onEditCustomer,
  onSectionSelect,
  sectionNavRef,
  paymentTermLabel,
  tagBadges = [],
}: CustomerDetailStickyOverviewProps) => (
  <>
    <div className="-mx-4 min-w-0 px-4 pb-4 pt-1 sm:-mx-6 sm:px-6">
      <div className="flex min-w-0 flex-col gap-8">
        <CustomerDetailBreadcrumb
          customerName={customer?.displayName ?? customer?.name}
          loading={detailsLoading}
        />
        <div className="flex flex-col gap-2">
          <CustomerDetailSummaryHeader
            customer={customer}
            loading={detailsLoading}
            onCreateNewLocation={onCreateNewLocation}
            onDeactivateCustomer={onDeactivateCustomer}
            onEditCustomer={onEditCustomer}
          />
          {tagBadges.length > 0 ? (
            <div className="flex flex-wrap gap-2 pl-1">
              {tagBadges.map((badge) => (
                <Badge
                  key={badge.label}
                  className={cn(
                    'rounded-[10px] px-2 py-px text-[13px] font-medium capitalize leading-[1.125rem]',
                    badge.tone === 'success' &&
                      'bg-[#f0ffef] text-[#34c759] hover:bg-[#f0ffef]',
                    badge.tone === 'action' &&
                      'bg-[#e9eefa] text-[#3538bf] hover:bg-[#e9eefa]',
                  )}
                  size="sm"
                  tone={badge.tone}
                  variant="soft"
                >
                  {badge.label}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        <CustomerDetailOverview
          customer={customer}
          detailsLoading={detailsLoading}
          financials={financials}
          metricsLoading={metricsLoading}
          paymentTermLabel={paymentTermLabel}
        />
      </div>
    </div>
    <div
      ref={sectionNavRef}
      className="sticky top-0 z-20 -mx-4 min-w-0 border-b border-border-subtle bg-surface px-4 sm:-mx-6 sm:px-6"
    >
      <CustomerDetailSectionNav
        activeSectionId={activeSectionId}
        onSectionSelect={onSectionSelect}
      />
    </div>
  </>
);
