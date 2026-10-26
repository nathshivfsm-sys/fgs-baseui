import { SectionHeader, SectionTitle } from '@cms/ui';
import { AR_CUSTOMER_SECTION_TITLE } from '../constant';
import type { BillToSearchFieldProps, BillToSummaryCardProps } from '../types';
import { BillToSearchField } from './BillToSearchField';
import { BillToSummaryCard } from './BillToSummaryCard';

export interface ArCustomerPanelProps
  extends BillToSearchFieldProps,
    BillToSummaryCardProps {}

export const ArCustomerPanel = ({
  customer,
  errorMessage,
  loading,
  onSelectCustomer,
  paymentTermLabel,
  queryClient,
}: ArCustomerPanelProps) => (
  <section className="min-w-0 px-5 pb-5 pt-5">
    <SectionHeader bordered className="shrink-0">
      <div className="flex w-full min-w-0 items-center gap-3">
        <SectionTitle size="sm">{AR_CUSTOMER_SECTION_TITLE}</SectionTitle>
        <BillToSearchField
          onSelectCustomer={onSelectCustomer}
          queryClient={queryClient}
        />
      </div>
    </SectionHeader>
    <div className="pt-4">
      <BillToSummaryCard
        customer={customer}
        errorMessage={errorMessage}
        loading={loading}
        paymentTermLabel={paymentTermLabel}
      />
    </div>
  </section>
);
