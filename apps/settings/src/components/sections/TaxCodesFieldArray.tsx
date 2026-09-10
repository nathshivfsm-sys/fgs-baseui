import { useFieldArray, useFormContext } from 'react-hook-form';
import { emptyTaxCode, type CompanySettings } from '@cms/settings-data-access';
import { BodySmall, Button, IconButton, TextInput, TrashIcon } from '@cms/ui';

export function TaxCodesFieldArray() {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<CompanySettings>();
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'taxCodes',
  });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            className="flex flex-col gap-3 rounded-lg bg-secondary/40 p-3 sm:flex-row sm:items-end"
            data-testid={`tax-code-row-${index}`}
            key={field.id}
          >
            <input type="hidden" {...register(`taxCodes.${index}.id`)} />
            <TextInput
              className="flex-1"
              error={errors.taxCodes?.[index]?.code?.message}
              label="Code"
              placeholder="e.g. CA"
              variant="soft"
              {...register(`taxCodes.${index}.code`)}
            />
            <TextInput
              className="flex-1"
              error={errors.taxCodes?.[index]?.description?.message}
              label="Description"
              placeholder="Optional description"
              variant="soft"
              {...register(`taxCodes.${index}.description`)}
            />
            <TextInput
              className="w-full sm:w-28"
              error={errors.taxCodes?.[index]?.rate?.message}
              label="Rate (%)"
              max={100}
              min={0}
              step="0.01"
              type="number"
              variant="soft"
              {...register(`taxCodes.${index}.rate`, { valueAsNumber: true })}
            />
            <IconButton
              className="text-destructive hover:text-destructive"
              icon={<TrashIcon className="size-4" />}
              label={`Remove tax code ${index + 1}`}
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
          No tax codes added yet
        </BodySmall>
      )}

      <Button
        className="w-full"
        onClick={() => append(emptyTaxCode())}
        type="button"
        variant="outline"
      >
        Add tax code
      </Button>
    </div>
  );
}
