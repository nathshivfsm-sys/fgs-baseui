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
  FILTER_ZONE_LABEL,
  FILTER_ZONE_PLACEHOLDER,
} from '../constant';
import type { TimeslotListFilterProps, TimeslotListFilters } from '../types';
import { countTimeslotListFilters } from '../types';

export const TimeslotListFilter = ({
  appliedFilters,
  onApply,
  onClear,
  zoneOptions,
}: TimeslotListFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TimeslotListFilters>(appliedFilters);
  const filterCount = countTimeslotListFilters(appliedFilters);
  const zoneSelectOptions: readonly SelectOption[] = [
    { label: FILTER_ANY_LABEL, value: '' },
    ...zoneOptions,
  ];

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(appliedFilters);
    }
    setOpen(next);
  };

  const handleZoneChange = (value: string | null) => {
    setDraft({ zoneId: value ?? '' });
  };

  const handleClear = () => {
    onClear();
    setDraft({ zoneId: '' });
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
          label={FILTER_ZONE_LABEL}
          labelSize="compact"
          onValueChange={handleZoneChange}
          options={zoneSelectOptions}
          placeholder={FILTER_ZONE_PLACEHOLDER}
          value={draft.zoneId}
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
