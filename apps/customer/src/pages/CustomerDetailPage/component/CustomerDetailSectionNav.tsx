import { cn } from '@cms/ui';
import {
  CUSTOMER_DETAIL_SECTIONS,
  type CustomerDetailSectionId,
} from '../constant';
import type { CustomerDetailSectionNavProps } from '../types';

export const CustomerDetailSectionNav = ({
  activeSectionId,
  onSectionSelect,
}: CustomerDetailSectionNavProps) => {
  const handleSectionClick = (sectionId: CustomerDetailSectionId) => {
    onSectionSelect(sectionId);
  };

  return (
    <nav
      aria-label="Customer detail sections"
      className="border-b border-border-subtle"
    >
      <div className="-mb-px flex gap-8 overflow-x-auto pb-0">
        {CUSTOMER_DETAIL_SECTIONS.map((section) => {
          const isActive = section.id === activeSectionId;
          return (
            <button
              key={section.id}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'shrink-0 border-b-2 pb-3 text-control transition-colors',
                isActive
                  ? 'border-primary font-semibold text-primary'
                  : 'border-transparent font-normal text-foreground-subtle hover:text-surface-foreground',
              )}
              onClick={() => handleSectionClick(section.id)}
              type="button"
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
