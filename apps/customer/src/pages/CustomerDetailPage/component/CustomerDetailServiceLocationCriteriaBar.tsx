import { Button, BodySmall } from '@cms/ui';
import { CUSTOMER_TYPE_OPTIONS } from '@cms/customer-ui';
import {
  CRITERIA_CLEAR_ALL_LABEL,
  CRITERIA_SEARCH_LABEL,
  FILTER_CUSTOMER_TYPE_LABEL,
} from '../constant';
import type { CustomerDetailServiceLocationCriteriaBarProps } from '../types';

export const CustomerDetailServiceLocationCriteriaBar = ({
  appliedFilters,
  onClearAll,
  search,
}: CustomerDetailServiceLocationCriteriaBarProps) => {
  const trimmedSearch = search.trim();
  const customerTypeLabel = CUSTOMER_TYPE_OPTIONS.find(
    (option) => option.value === appliedFilters.customerType,
  )?.label;
  const hasCriteria =
    Boolean(trimmedSearch) || Boolean(appliedFilters.customerType);

  if (!hasCriteria) return null;

  const handleClearAll = () => {
    onClearAll();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle px-6 py-2">
      <BodySmall color="foreground-subtle">Applied:</BodySmall>
      {trimmedSearch ? (
        <BodySmall>
          {CRITERIA_SEARCH_LABEL}: &quot;{trimmedSearch}&quot;
        </BodySmall>
      ) : null}
      {customerTypeLabel ? (
        <BodySmall>
          {FILTER_CUSTOMER_TYPE_LABEL}: {customerTypeLabel}
        </BodySmall>
      ) : null}
      <Button
        className="h-auto px-2 py-1 text-caption"
        onClick={handleClearAll}
        type="button"
        variant="ghost"
      >
        {CRITERIA_CLEAR_ALL_LABEL}
      </Button>
    </div>
  );
};
