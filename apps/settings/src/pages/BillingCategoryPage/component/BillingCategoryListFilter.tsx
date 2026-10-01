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
  FILTER_ALLOW_PICK_LABEL,
  FILTER_ANY_LABEL,
  FILTER_APPLY_LABEL,
  FILTER_CLEAR_LABEL,
  FILTER_LABEL,
  FILTER_NO_LABEL,
  FILTER_SHOW_FIELD_TECH_LABEL,
  FILTER_SYSTEM_DEFINED_LABEL,
  FILTER_TYPE_LABEL,
  FILTER_TYPE_PLACEHOLDER,
  FILTER_YES_LABEL,
} from '../constant';
import type {
  BillingCategoryListFilterProps,
  BillingCategoryListFilters,
  BillingCategoryTriStateFilter,
} from '../types';
import { countBillingCategoryListFilters } from '../types';

const triStateOptions: readonly SelectOption[] = [
  { label: FILTER_ANY_LABEL, value: '' },
  { label: FILTER_YES_LABEL, value: 'true' },
  { label: FILTER_NO_LABEL, value: 'false' },
];

export const BillingCategoryListFilter = ({
  appliedFilters,
  onApply,
  onClear,
  typeOptions,
}: BillingCategoryListFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] =
    useState<BillingCategoryListFilters>(appliedFilters);

  const typeSelectOptions: readonly SelectOption[] = [
    { label: FILTER_ANY_LABEL, value: '' },
    ...(typeOptions ?? [])
      .filter((option) => Boolean(option.billingCategoryType))
      .map((option) => ({
        value: option.billingCategoryType as string,
        label: option.billingCategoryName ?? option.billingCategoryType ?? '',
      })),
  ];

  const filterActive = countBillingCategoryListFilters(appliedFilters) > 0;
  const activeFilterCount = countBillingCategoryListFilters(appliedFilters);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(appliedFilters);
    }
    setOpen(next);
  };

  const handleTypeChange = (value: string | null) => {
    setDraft((current) => ({
      ...current,
      billingCategoryType: value ?? '',
    }));
  };

  const handleTriStateChange =
    (
      key: keyof Pick<
        BillingCategoryListFilters,
        'isSystemDefined' | 'showToFieldTech' | 'allowToPick'
      >,
    ) =>
    (value: string | null) => {
      setDraft((current) => ({
        ...current,
        [key]: (value ?? '') as BillingCategoryTriStateFilter,
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
          label={FILTER_TYPE_LABEL}
          labelSize="compact"
          onValueChange={handleTypeChange}
          options={typeSelectOptions}
          placeholder={FILTER_TYPE_PLACEHOLDER}
          value={draft.billingCategoryType}
          variant="soft"
        />
        <SelectField
          label={FILTER_SYSTEM_DEFINED_LABEL}
          labelSize="compact"
          onValueChange={handleTriStateChange('isSystemDefined')}
          options={triStateOptions}
          value={draft.isSystemDefined}
          variant="soft"
        />
        <SelectField
          label={FILTER_SHOW_FIELD_TECH_LABEL}
          labelSize="compact"
          onValueChange={handleTriStateChange('showToFieldTech')}
          options={triStateOptions}
          value={draft.showToFieldTech}
          variant="soft"
        />
        <SelectField
          label={FILTER_ALLOW_PICK_LABEL}
          labelSize="compact"
          onValueChange={handleTriStateChange('allowToPick')}
          options={triStateOptions}
          value={draft.allowToPick}
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
