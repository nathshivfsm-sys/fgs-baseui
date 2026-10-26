import { useState } from 'react';
import {
  Button,
  FilterIcon,
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  SelectField,
  cn,
  type SelectOption,
} from '@cms/ui';
import {
  FILTER_ANY_LABEL,
  FILTER_APPLY_LABEL,
  FILTER_CLEAR_LABEL,
  FILTER_LABEL,
  FILTER_NO_LABEL,
  FILTER_PREFERRED_LABEL,
  FILTER_YES_LABEL,
} from '../constant';
import type { CustomerListFilterProps, CustomerListFilters } from '../types';
import { countCustomerListFilters } from '../util';

const preferredOptions: readonly SelectOption[] = [
  { label: FILTER_ANY_LABEL, value: '' },
  { label: FILTER_YES_LABEL, value: 'true' },
  { label: FILTER_NO_LABEL, value: 'false' },
];

export const CustomerListFilter = ({
  appliedFilters,
  onApply,
  onClear,
}: CustomerListFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CustomerListFilters>(appliedFilters);

  const filterActive = countCustomerListFilters(appliedFilters) > 0;
  const activeFilterCount = countCustomerListFilters(appliedFilters);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(appliedFilters);
    }
    setOpen(next);
  };

  const handlePreferredChange = (value: string | null) => {
    setDraft((current) => ({
      ...current,
      isPreferred: (value ?? '') as CustomerListFilters['isPreferred'],
    }));
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  const handleClear = () => {
    onClear();
    setOpen(false);
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger
        render={
          <Button
            aria-label={
              filterActive
                ? `${FILTER_LABEL} (${activeFilterCount} active)`
                : FILTER_LABEL
            }
            className={cn(
              'shrink-0',
              filterActive &&
                'border-primary text-primary ring-1 ring-primary/30',
            )}
            type="button"
            variant="outline"
          />
        }
      >
        <FilterIcon className="size-3.5" />
        {FILTER_LABEL}
        {filterActive ? ` (${activeFilterCount})` : ''}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <PopoverHeader>
          <PopoverTitle>{FILTER_LABEL}</PopoverTitle>
        </PopoverHeader>
        <SelectField
          label={FILTER_PREFERRED_LABEL}
          onValueChange={handlePreferredChange}
          options={preferredOptions}
          value={draft.isPreferred}
        />
        <PopoverFooter className="gap-2">
          <Button onClick={handleClear} type="button" variant="outline">
            {FILTER_CLEAR_LABEL}
          </Button>
          <Button onClick={handleApply} type="button">
            {FILTER_APPLY_LABEL}
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
