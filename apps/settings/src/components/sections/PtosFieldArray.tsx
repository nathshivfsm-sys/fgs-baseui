import { useFieldArray, useFormContext } from 'react-hook-form';
import { emptyPto, type CompanySettings } from '@cms/settings-data-access';
import { BodySmall, Button, IconButton, TextInput, TrashIcon } from '@cms/ui';

export function PtosFieldArray() {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<CompanySettings>();
  const { append, fields, remove } = useFieldArray({ control, name: 'ptos' });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            className="flex flex-col gap-3 rounded-lg bg-secondary/40 p-3 sm:flex-row sm:items-end"
            data-testid={`pto-row-${index}`}
            key={field.id}
          >
            <input type="hidden" {...register(`ptos.${index}.id`)} />
            <TextInput
              className="flex-1"
              error={errors.ptos?.[index]?.code?.message}
              label="Code"
              placeholder="e.g. VAC"
              variant="soft"
              {...register(`ptos.${index}.code`)}
            />
            <TextInput
              className="flex-1"
              error={errors.ptos?.[index]?.label?.message}
              label="Label"
              placeholder="e.g. Vacation"
              variant="soft"
              {...register(`ptos.${index}.label`)}
            />
            <TextInput
              className="w-full sm:w-28"
              error={errors.ptos?.[index]?.annualAllowance?.message}
              label="Annual days"
              min={1}
              step="1"
              type="number"
              variant="soft"
              {...register(`ptos.${index}.annualAllowance`, {
                valueAsNumber: true,
              })}
            />
            <IconButton
              className="text-destructive hover:text-destructive"
              icon={<TrashIcon className="size-4" />}
              label={`Remove PTO type ${index + 1}`}
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
          No PTO types added yet
        </BodySmall>
      )}

      <Button
        className="w-full"
        onClick={() => append(emptyPto())}
        type="button"
        variant="outline"
      >
        Add PTO type
      </Button>
    </div>
  );
}
