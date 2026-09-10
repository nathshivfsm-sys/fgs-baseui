import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import {
  emptyBusinessUnit,
  type CompanySettings,
} from '@cms/settings-data-access';
import {
  BodySmall,
  Button,
  IconButton,
  SwitchField,
  TextInput,
  TrashIcon,
} from '@cms/ui';

export function BusinessUnitsFieldArray() {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<CompanySettings>();
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'businessUnits',
  });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            className="flex flex-col gap-3 rounded-lg bg-secondary/40 p-3 sm:flex-row sm:items-end"
            data-testid={`business-unit-row-${index}`}
            key={field.id}
          >
            <input type="hidden" {...register(`businessUnits.${index}.id`)} />
            <TextInput
              className="flex-1"
              error={errors.businessUnits?.[index]?.name?.message}
              label="Name"
              placeholder="e.g. Residential"
              variant="soft"
              {...register(`businessUnits.${index}.name`)}
            />
            <TextInput
              className="flex-1"
              error={errors.businessUnits?.[index]?.code?.message}
              label="Code"
              placeholder="e.g. RES"
              variant="soft"
              {...register(`businessUnits.${index}.code`)}
            />
            <Controller
              control={control}
              name={`businessUnits.${index}.active`}
              render={({ field: switchField }) => (
                <SwitchField
                  checked={switchField.value}
                  label="Active"
                  onCheckedChange={switchField.onChange}
                />
              )}
            />
            <IconButton
              className="text-destructive hover:text-destructive"
              icon={<TrashIcon className="size-4" />}
              label={`Remove business unit ${index + 1}`}
              onClick={() => remove(index)}
              size="sm"
              type="button"
              variant="ghost"
            />
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <BodySmall
          className="py-6 text-center"
          color="foreground-subtle"
        >
          No business units added yet
        </BodySmall>
      )}

      <Button
        className="w-full"
        onClick={() => append(emptyBusinessUnit())}
        type="button"
        variant="outline"
      >
        Add business unit
      </Button>
    </div>
  );
}
