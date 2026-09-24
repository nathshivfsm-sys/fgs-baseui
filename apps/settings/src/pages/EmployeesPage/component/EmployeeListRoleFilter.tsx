import { useState } from 'react';
import {
  Button,
  FilterIcon,
  MultiSelectField,
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  cn,
  type SelectOption,
} from '@cms/ui';
import {
  FILTER_APPLY_LABEL,
  FILTER_CLEAR_LABEL,
  FILTER_LABEL,
  FILTER_ROLE_LABEL,
  FILTER_ROLE_PLACEHOLDER,
} from '../constant';
import type { EmployeeListRoleFilterProps } from '../types';

export const EmployeeListRoleFilter = ({
  appliedRoleIds,
  onApply,
  onClear,
  roles,
}: EmployeeListRoleFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draftRoleIds, setDraftRoleIds] = useState<string[]>([]);

  const roleOptions: readonly SelectOption[] = (roles ?? []).map((role) => ({
    label: role.name ?? role.roleCode ?? String(role.id),
    value: String(role.id),
  }));

  const filterActive = appliedRoleIds.length > 0;

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraftRoleIds([...appliedRoleIds]);
    }
    setOpen(next);
  };

  const handleDraftChange = (value: string[]) => {
    setDraftRoleIds(value);
  };

  const handleApply = () => {
    onApply(draftRoleIds);
    setOpen(false);
  };

  const handleClear = () => {
    setDraftRoleIds([]);
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
                ? `${FILTER_LABEL} (${appliedRoleIds.length} active)`
                : `${FILTER_LABEL} by role`
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
            {appliedRoleIds.length}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>{FILTER_LABEL}</PopoverTitle>
        </PopoverHeader>
        <MultiSelectField
          label={FILTER_ROLE_LABEL}
          labelSize="compact"
          onValueChange={handleDraftChange}
          options={roleOptions}
          placeholder={FILTER_ROLE_PLACEHOLDER}
          value={draftRoleIds}
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
