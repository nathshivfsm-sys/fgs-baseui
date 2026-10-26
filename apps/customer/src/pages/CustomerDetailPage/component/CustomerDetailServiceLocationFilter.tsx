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
import { CUSTOMER_TYPE_OPTIONS } from '@cms/customer-ui';
import {
  FILTER_ANY_LABEL,
  FILTER_APPLY_LABEL,
  FILTER_CLEAR_LABEL,
  FILTER_CUSTOMER_TYPE_LABEL,
} from '../constant';
import type { CustomerDetailServiceLocationFilterProps } from '../types';
import { countServiceLocationListFilters } from '../util';

const customerTypeOptions: readonly SelectOption[] = [
  { label: FILTER_ANY_LABEL, value: '' },
  ...CUSTOMER_TYPE_OPTIONS,
];

export const CustomerDetailServiceLocationFilter = ({
  appliedFilters,
  onApply,
  onClear,
}: CustomerDetailServiceLocationFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(appliedFilters);

  const filterActive = countServiceLocationListFilters(appliedFilters) > 0;
  const activeFilterCount = countServiceLocationListFilters(appliedFilters);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(appliedFilters);
    }
    setOpen(next);
  };

  const handleCustomerTypeChange = (value: string | null) => {
    setDraft((current) => ({
      ...current,
      customerType: (value ?? '') as typeof current.customerType,
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
              filterActive ? `Filter (${activeFilterCount} active)` : 'Filter'
            }
            className={cn(
              'shrink-0',
              filterActive &&
                'border-action bg-action-subtle text-action hover:bg-action-subtle',
            )}
            type="button"
            variant="outline"
          >
            <FilterIcon className="size-3.5" />
            Filter
          </Button>
        }
      />
      <PopoverContent align="end" className="w-72">
        <PopoverHeader>
          <PopoverTitle>Filter service locations</PopoverTitle>
        </PopoverHeader>
        <SelectField
          label={FILTER_CUSTOMER_TYPE_LABEL}
          onValueChange={handleCustomerTypeChange}
          options={customerTypeOptions}
          value={draft.customerType}
        />
        <PopoverFooter>
          <Button onClick={handleClear} type="button" variant="ghost">
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
