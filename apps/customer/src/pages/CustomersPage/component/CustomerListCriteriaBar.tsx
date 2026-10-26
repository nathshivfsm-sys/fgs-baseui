import { Button, BodySmall } from '@cms/ui';
import {
  CRITERIA_CLEAR_ALL_LABEL,
  CRITERIA_SEARCH_LABEL,
  FILTER_PREFERRED_LABEL,
  FILTER_NO_LABEL,
  FILTER_YES_LABEL,
} from '../constant';
import type { CustomerListCriteriaBarProps } from '../types';

export const CustomerListCriteriaBar = ({
  appliedFilters,
  onClearAll,
  search,
}: CustomerListCriteriaBarProps) => {
  const trimmedSearch = search.trim();
  const hasPreferredFilter = appliedFilters.isPreferred !== '';
  const hasCriteria = Boolean(trimmedSearch) || hasPreferredFilter;

  if (!hasCriteria) return null;

  const handleClearAll = () => {
    onClearAll();
  };

  const preferredLabel =
    appliedFilters.isPreferred === 'true'
      ? FILTER_YES_LABEL
      : appliedFilters.isPreferred === 'false'
        ? FILTER_NO_LABEL
        : '';

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle px-6 py-2">
      <BodySmall color="foreground-subtle">Applied:</BodySmall>
      {trimmedSearch ? (
        <BodySmall>
          {CRITERIA_SEARCH_LABEL}: &quot;{trimmedSearch}&quot;
        </BodySmall>
      ) : null}
      {hasPreferredFilter ? (
        <BodySmall>
          {FILTER_PREFERRED_LABEL}: {preferredLabel}
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
