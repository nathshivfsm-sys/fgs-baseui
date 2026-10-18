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
  FILTER_ENTITY_LABEL,
  FILTER_ENTITY_PLACEHOLDER,
  FILTER_LABEL,
  TAG_ENTITY_OPTIONS,
} from '../constant';
import type { TagListFilterProps, TagListFilters } from '../types';
import { countTagListFilters } from '../types';

export const TagListFilter = ({
  appliedFilters,
  onApply,
  onClear,
}: TagListFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TagListFilters>(appliedFilters);
  const filterCount = countTagListFilters(appliedFilters);
  const entityOptions: readonly SelectOption[] = [
    { label: FILTER_ANY_LABEL, value: '' },
    ...TAG_ENTITY_OPTIONS,
  ];

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(appliedFilters);
    }
    setOpen(next);
  };

  const handleEntityChange = (value: string | null) => {
    setDraft({ entity: value ?? '' });
  };

  const handleClear = () => {
    onClear();
    setDraft({ entity: '' });
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
          >
            <FilterIcon className="size-3.5" />
            {FILTER_LABEL}
            {filterCount > 0 ? (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {filterCount}
              </span>
            ) : null}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-72">
        <PopoverHeader>
          <PopoverTitle>{FILTER_LABEL}</PopoverTitle>
        </PopoverHeader>
        <SelectField
          label={FILTER_ENTITY_LABEL}
          onValueChange={handleEntityChange}
          options={[...entityOptions]}
          placeholder={FILTER_ENTITY_PLACEHOLDER}
          value={draft.entity}
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
