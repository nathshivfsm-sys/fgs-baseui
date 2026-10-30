import { useState } from 'react';
import type { JobTypeSummaryDto } from '@cms/settings-contract';
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
  FILTER_JOB_TYPE_LABEL,
  FILTER_LABEL,
  FILTER_NO_LABEL,
  FILTER_TAXABLE_LABEL,
  FILTER_YES_LABEL,
} from '../constant';
import type { PricebookListFilterProps, PricebookListFilters } from '../types';
import { countPricebookFilters } from '../util';

const taxableOptions: readonly SelectOption[] = [
  { label: FILTER_ANY_LABEL, value: '' },
  { label: FILTER_YES_LABEL, value: 'true' },
  { label: FILTER_NO_LABEL, value: 'false' },
];

const toJobTypeOptions = (
  jobTypes: readonly JobTypeSummaryDto[],
): SelectOption[] => [
  { label: FILTER_ANY_LABEL, value: '' },
  ...[...jobTypes]
    .sort((left, right) =>
      (left.name ?? '').localeCompare(right.name ?? '', undefined, {
        sensitivity: 'base',
      }),
    )
    .map((jobType) => ({
      value: String(jobType.id),
      label:
        jobType.name?.trim() ||
        jobType.jobTypeCode?.trim() ||
        `Job type ${jobType.id}`,
    })),
];

export const PricebookListFilter = ({
  appliedFilters,
  jobTypes,
  onApply,
  onClear,
}: PricebookListFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PricebookListFilters>(appliedFilters);
  const activeFilterCount = countPricebookFilters(appliedFilters);
  const filterActive = activeFilterCount > 0;

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(appliedFilters);
    setOpen(next);
  };

  const handleJobTypeChange = (value: string | null) => {
    setDraft((current) => ({ ...current, jobTypeId: value ?? '' }));
  };

  const handleTaxableChange = (value: string | null) => {
    const next = value === 'true' || value === 'false' ? value : '';
    setDraft((current) => ({ ...current, isTaxable: next }));
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
        {filterActive ? (
          <span
            aria-hidden
            className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold leading-none text-action-foreground"
          >
            {activeFilterCount}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-80 flex-col gap-3">
        <PopoverHeader>
          <PopoverTitle>{FILTER_LABEL}</PopoverTitle>
        </PopoverHeader>
        <SelectField
          label={FILTER_JOB_TYPE_LABEL}
          labelSize="compact"
          onValueChange={handleJobTypeChange}
          options={toJobTypeOptions(jobTypes)}
          placeholder="Any job type"
          value={draft.jobTypeId}
          variant="soft"
        />
        <SelectField
          label={FILTER_TAXABLE_LABEL}
          labelSize="compact"
          onValueChange={handleTaxableChange}
          options={taxableOptions}
          value={draft.isTaxable}
          variant="soft"
        />
        <PopoverFooter>
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
