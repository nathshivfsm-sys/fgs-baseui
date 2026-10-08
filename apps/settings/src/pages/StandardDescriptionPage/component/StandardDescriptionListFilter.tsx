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
  FILTER_TRADE_LABEL,
  FILTER_TRADE_PLACEHOLDER,
  FILTER_TYPE_LABEL,
  FILTER_TYPE_PLACEHOLDER,
} from '../constant';
import type {
  StandardDescriptionListFilterProps,
  StandardDescriptionListFilters,
} from '../types';
import { countStandardDescriptionListFilters } from '../types';
import { findDescriptionTypeLabel } from '../util';

export const StandardDescriptionListFilter = ({
  appliedFilters,
  onApply,
  onClear,
  showTradeFilter,
  tradeOptions,
  typeOptions,
}: StandardDescriptionListFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] =
    useState<StandardDescriptionListFilters>(appliedFilters);

  const typeSelectOptions: readonly SelectOption[] = [
    { label: FILTER_ANY_LABEL, value: '' },
    ...(typeOptions ?? [])
      .filter((option) => Boolean(option.code))
      .map((option) => ({
        value: option.code as string,
        label: findDescriptionTypeLabel(option.code, typeOptions),
      })),
  ];

  const tradeSelectOptions: readonly SelectOption[] = [
    { label: FILTER_ANY_LABEL, value: '' },
    ...tradeOptions.map((option) => ({
      value: String(option.id),
      label: option.label,
    })),
  ];

  const filterActive = countStandardDescriptionListFilters(appliedFilters) > 0;
  const activeFilterCount = countStandardDescriptionListFilters(appliedFilters);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(appliedFilters);
    }
    setOpen(next);
  };

  const handleTypeChange = (value: string | null) => {
    setDraft((current) => ({
      ...current,
      descriptionTypeCode: value ?? '',
    }));
  };

  const handleTradeChange = (value: string | null) => {
    setDraft((current) => ({
      ...current,
      tradeId: value ?? '',
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
            className={cn(filterActive && 'border-action text-action')}
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
        <div className="flex flex-col gap-3 py-2">
          <SelectField
            label={FILTER_TYPE_LABEL}
            onValueChange={handleTypeChange}
            options={typeSelectOptions}
            placeholder={FILTER_TYPE_PLACEHOLDER}
            value={draft.descriptionTypeCode}
            variant="soft"
          />
          {showTradeFilter ? (
            <SelectField
              label={FILTER_TRADE_LABEL}
              onValueChange={handleTradeChange}
              options={tradeSelectOptions}
              placeholder={FILTER_TRADE_PLACEHOLDER}
              value={draft.tradeId}
              variant="soft"
            />
          ) : null}
        </div>
        <PopoverFooter className="gap-2">
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
