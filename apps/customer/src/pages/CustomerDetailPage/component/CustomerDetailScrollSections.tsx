import { BodySmall, SectionCard, SectionTitle } from '@cms/ui';
import { CUSTOMER_DETAIL_SECTIONS } from '../constant';
import type { CustomerDetailScrollSectionsProps } from '../types';
import { CustomerDetailServiceLocationsSection } from './CustomerDetailServiceLocationsSection';

export const CustomerDetailScrollSections = ({
  customerId,
  onAddLocation,
  onEditLocation,
  onViewLocation,
  queryClient,
  stickyOffsetPx,
}: CustomerDetailScrollSectionsProps) => (
  <div className="flex flex-col gap-8 pb-12 pt-6">
    {CUSTOMER_DETAIL_SECTIONS.map((section) => (
      <SectionCard
        key={section.id}
        className={
          section.id === 'customer-service-locations'
            ? 'scroll-mt-6 p-0'
            : 'scroll-mt-6 p-5'
        }
        id={section.id}
        padding="none"
        radius="panel"
        style={{ scrollMarginTop: stickyOffsetPx + 16 }}
      >
        {section.id === 'customer-service-locations' ? (
          <CustomerDetailServiceLocationsSection
            customerId={customerId}
            onAddLocation={onAddLocation}
            onEditLocation={onEditLocation}
            onViewLocation={onViewLocation}
            queryClient={queryClient}
          />
        ) : (
          <>
            <SectionTitle className="mb-2">{section.label}</SectionTitle>
            <BodySmall color="foreground-subtle">
              {section.label} content will appear here once this area is wired
              to data.
            </BodySmall>
          </>
        )}
      </SectionCard>
    ))}
  </div>
);
