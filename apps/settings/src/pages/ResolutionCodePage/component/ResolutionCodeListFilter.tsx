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
  FILTER_TYPE_LABEL,
  FILTER_TYPE_PLACEHOLDER,
  RESOLUTION_TYPE_OPTIONS,
} from '../constant';
import type {
  ResolutionCodeListFilterProps,
  ResolutionCodeListFilters,
} from '../types';
import { countResolutionCodeListFilters } from '../types';

export const ResolutionCodeListFilter = ({
  appliedFilters,
  onApply,
  onClear,
}: ResolutionCodeListFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ResolutionCodeListFilters>(appliedFilters);
  const filterCount = countResolutionCodeListFilters(appliedFilters);
  const typeSelectOptions: readonly SelectOption[] = [
    { label: FILTER_ANY_LABEL, value: '' },
    ...RESOLUTION_TYPE_OPTIONS,
  ];

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(appliedFilters);
    }
    setOpen(next);
  };

  const handleTypeChange = (value: string | null) => {
    setDraft({ typeId: value ?? '' });
  };

  const handleClear = () => {
    onClear();
    setDraft({ typeId: '' });
    setOpen(false);
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger
        render={
          <Button
            aria-label={
              filterCount > 0
                ? `${FILTER_LABEL} (${filterCount} active)`
                : FILTER_LABEL
            }
            className={cn(
              'shrink-0',
              filterCount > 0 &&
                'border-primary text-primary ring-1 ring-primary/30',
            )}
            type="button"
            variant="outline"
          />
        }
      >
        <FilterIcon className="size-3.5" />
        {FILTER_LABEL}
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-72 flex-col gap-3">
        <PopoverHeader>
          <PopoverTitle>{FILTER_LABEL}</PopoverTitle>
        </PopoverHeader>
        <SelectField
          label={FILTER_TYPE_LABEL}
          labelSize="compact"
          onValueChange={handleTypeChange}
          options={typeSelectOptions}
          placeholder={FILTER_TYPE_PLACEHOLDER}
          value={draft.typeId}
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
