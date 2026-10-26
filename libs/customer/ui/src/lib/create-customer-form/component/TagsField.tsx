import { Controller, useFormContext } from 'react-hook-form';
import type { CustomerCreateForm } from '@cms/customer-data-access';
import { Badge, MultiSelectField, type SelectOption } from '@cms/ui';

export interface TagsFieldProps {
  disabled?: boolean;
  name: 'tagIds' | 'serviceLocation.tagIds';
  options: readonly SelectOption[];
}

const toStringIds = (ids: number[] | undefined): string[] =>
  (ids ?? []).map((id) => String(id));

const toNumberIds = (values: string[]): number[] =>
  values
    .map((value) => Number.parseInt(value, 10))
    .filter((id) => !Number.isNaN(id));

const renderTagChips = (selected: SelectOption[]) => {
  if (selected.length === 0) {
    return null;
  }

  return (
    <span className="flex flex-wrap items-center gap-1 py-0.5">
      {selected.map((option) => (
        <Badge key={option.value} size="sm" tone="action">
          {option.label}
        </Badge>
      ))}
    </span>
  );
};

export const TagsField = ({ disabled, name, options }: TagsFieldProps) => {
  const { control } = useFormContext<CustomerCreateForm>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <MultiSelectField
          disabled={disabled}
          error={fieldState.error?.message}
          label="Tags"
          name={field.name}
          onValueChange={(next) => field.onChange(toNumberIds(next))}
          options={options}
          placeholder="Select or add tags"
          renderValue={renderTagChips}
          triggerClassName="h-auto min-h-9 py-1.5"
          value={toStringIds(field.value as number[] | undefined)}
          variant="soft"
        />
      )}
    />
  );
};
