import { useQuery } from '@tanstack/react-query';
import { BodySmall, Button } from '@cms/ui';
import { serviceLocationListQueryOptions } from '@cms/customer-data-access';
import { LOAD_SERVICE_LOCATIONS_ERROR_TITLE } from '../constant';
import type { CustomerDetailServiceLocationsSectionProps } from '../types';
import { describeCatalogError } from '../../../util/describe-catalog-error';
import { CustomerDetailServiceLocationEmptyState } from './CustomerDetailServiceLocationEmptyState';
import { CustomerDetailServiceLocationTablePanel } from './CustomerDetailServiceLocationTablePanel';

export const CustomerDetailServiceLocationsSection = ({
  customerId,
  onAddLocation,
  onEditLocation,
  onViewLocation,
  queryClient,
}: CustomerDetailServiceLocationsSectionProps) => {
  const probeQuery = useQuery(
    serviceLocationListQueryOptions(customerId, {
      page: 1,
      pageSize: 1,
      includeSummary: true,
      isActive: true,
    }),
    queryClient,
  );

  const summary = probeQuery.data?.summary;
  const totalLocations =
    (summary?.activeCount ?? 0) + (summary?.inactiveCount ?? 0);
  const showGlobalEmpty =
    !probeQuery.isPending && !probeQuery.isError && totalLocations === 0;

  const handleRetry = () => {
    void probeQuery.refetch();
  };

  if (probeQuery.isPending) {
    return (
      <div
        className="min-h-[16rem] animate-pulse rounded-lg border border-border-subtle bg-secondary motion-reduce:animate-none"
        data-testid="customer-service-locations-loading"
      />
    );
  }

  if (probeQuery.isError) {
    const message = describeCatalogError(probeQuery.error, {
      forbidden: 'You do not have permission to view service locations.',
      notFound: 'Service locations could not be found for this customer.',
      conflict: 'Service locations could not be loaded because of a conflict.',
      invalid: 'The service location request was invalid.',
      unreachable: 'The customer service is unavailable.',
      defaultMessage: LOAD_SERVICE_LOCATIONS_ERROR_TITLE,
    });

    return (
      <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface p-5">
        <BodySmall color="foreground-subtle">{message}</BodySmall>
        <Button onClick={handleRetry} type="button" variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (showGlobalEmpty) {
    return (
      <CustomerDetailServiceLocationEmptyState onAddLocation={onAddLocation} />
    );
  }

  return (
    <CustomerDetailServiceLocationTablePanel
      customerId={customerId}
      onAddLocation={onAddLocation}
      onEditLocation={onEditLocation}
      onViewLocation={onViewLocation}
      queryClient={queryClient}
    />
  );
};
