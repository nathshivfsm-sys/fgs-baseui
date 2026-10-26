import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  customerDetailQueryOptions,
  customerFinancialSummaryQueryOptions,
} from '@cms/customer-data-access';
import {
  paymentTermLookupQueryOptions,
  tagLookupQueryOptions,
} from '@cms/shared-data-access';
import { BodySmall } from '@cms/ui';
import { resolveCustomerTagBadges } from '../../shared';
import {
  CustomerDetailScrollSections,
  CustomerDetailStickyOverview,
} from './component';
import {
  CUSTOMER_DETAIL_SECTION_IDS,
  serviceLocationCreatePath,
} from './constant';
import type { CustomerDetailPageProps } from './types';
import {
  mapCustomerFinancialSummary,
  resolvePaymentTermLabel,
  useCustomerDetailSectionNav,
} from './util';
import { describeCatalogError } from '../../util/describe-catalog-error';

const parseCustomerId = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

export const CustomerDetailPage = ({
  queryClient,
}: CustomerDetailPageProps) => {
  const navigate = useNavigate();
  const { customerId: customerIdParam } = useParams<{ customerId: string }>();
  const customerId = parseCustomerId(customerIdParam);
  const sectionNavRef = useRef<HTMLDivElement>(null);
  const [stickyOffsetPx, setStickyOffsetPx] = useState(0);

  const customerQuery = useQuery(
    {
      ...customerDetailQueryOptions(customerId ?? 0),
      enabled: customerId != null,
    },
    queryClient,
  );
  const financialSummaryQuery = useQuery(
    {
      ...customerFinancialSummaryQueryOptions(customerId ?? 0),
      enabled: customerId != null,
    },
    queryClient,
  );
  const paymentTermsQuery = useQuery(
    paymentTermLookupQueryOptions(true),
    queryClient,
  );
  const tagsQuery = useQuery(tagLookupQueryOptions(true), queryClient);

  const { activeSectionId, scrollToSection } = useCustomerDetailSectionNav(
    CUSTOMER_DETAIL_SECTION_IDS,
    stickyOffsetPx,
  );

  useLayoutEffect(() => {
    const element = sectionNavRef.current;
    if (!element) return;

    const updateOffset = () => {
      setStickyOffsetPx(element.getBoundingClientRect().height);
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(element);
    return () => observer.disconnect();
  }, [
    customerQuery.data,
    customerQuery.isPending,
    financialSummaryQuery.data,
    tagsQuery.data,
  ]);

  const paymentTermLabel = useMemo(
    () =>
      resolvePaymentTermLabel(
        customerQuery.data?.defaultPaymentTermId,
        paymentTermsQuery.data,
      ),
    [customerQuery.data?.defaultPaymentTermId, paymentTermsQuery.data],
  );

  const tagBadges = useMemo(
    () => resolveCustomerTagBadges(customerQuery.data?.tagIds, tagsQuery.data),
    [customerQuery.data?.tagIds, tagsQuery.data],
  );

  const financials = useMemo(
    () => mapCustomerFinancialSummary(financialSummaryQuery.data),
    [financialSummaryQuery.data],
  );

  const handleEditCustomer = () => {
    // Edit flow will navigate to an edit route once that screen exists.
  };

  const handleAddLocation = () => {
    if (customerId == null) return;
    navigate(serviceLocationCreatePath(customerId));
  };

  const handleEditLocation = (_locationId: number) => {
    // Edit service location route will be added in a follow-up.
  };

  const handleViewLocation = (_locationId: number) => {
    // Service location detail route will be added in a follow-up.
  };

  const handleSectionSelect = (
    sectionId: (typeof CUSTOMER_DETAIL_SECTION_IDS)[number],
  ) => {
    scrollToSection(sectionId);
  };

  if (customerId == null) {
    return (
      <section
        className="flex flex-col gap-3"
        data-testid="customer-detail-page"
      >
        <BodySmall color="foreground-subtle">
          The customer id in the URL is invalid.
        </BodySmall>
        <Link
          className="text-action underline-offset-2 hover:underline"
          to=".."
        >
          Back to customers
        </Link>
      </section>
    );
  }

  if (customerQuery.isError) {
    const message = describeCatalogError(customerQuery.error, {
      forbidden: 'You do not have permission to view this customer.',
      notFound: 'That customer could not be found.',
      conflict: 'This customer could not be loaded because of a conflict.',
      invalid: 'The customer request was invalid.',
      unreachable: 'The customer service is unavailable.',
      defaultMessage: 'Something went wrong while loading this customer.',
    });

    return (
      <section
        className="flex flex-col gap-3"
        data-testid="customer-detail-page"
      >
        <BodySmall color="foreground-subtle">{message}</BodySmall>
        <Link
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-surface px-4 text-control font-medium text-surface-foreground hover:bg-secondary"
          to=".."
        >
          Back to customers
        </Link>
      </section>
    );
  }

  return (
    <section
      className="flex min-w-0 flex-col overflow-x-hidden"
      data-testid="customer-detail-page"
    >
      <CustomerDetailStickyOverview
        activeSectionId={activeSectionId}
        customer={customerQuery.data}
        detailsLoading={customerQuery.isPending}
        financials={financials}
        metricsLoading={
          financialSummaryQuery.isPending && !financialSummaryQuery.isError
        }
        onCreateNewLocation={handleAddLocation}
        onEditCustomer={handleEditCustomer}
        onSectionSelect={handleSectionSelect}
        sectionNavRef={sectionNavRef}
        paymentTermLabel={paymentTermLabel}
        tagBadges={tagBadges}
      />
      {customerId != null ? (
        <CustomerDetailScrollSections
          customerId={customerId}
          onAddLocation={handleAddLocation}
          onEditLocation={handleEditLocation}
          onViewLocation={handleViewLocation}
          queryClient={queryClient}
          stickyOffsetPx={stickyOffsetPx}
        />
      ) : null}
    </section>
  );
};
