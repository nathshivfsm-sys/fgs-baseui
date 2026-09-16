import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  emptyTaxForm,
  toTaxFormValues,
  toTaxWriteDto,
  taxFormSchema,
  type TaxForm,
} from '@cms/settings-data-access';
import type { TaxCreateDto, TaxSummaryDto } from '@cms/settings-contract';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SectionCard,
  SwitchField,
} from '@cms/ui';
import {
  CREATE_TAX_DESCRIPTION,
  CREATE_TAX_TITLE,
  EDIT_TAX_DESCRIPTION,
  EDIT_TAX_TITLE,
  TAX_CITY_OPTIONS,
  TAX_CITY_PLACEHOLDER,
  TAX_CODE_PLACEHOLDER,
  TAX_COUNTY_PLACEHOLDER,
  TAX_NAME_PLACEHOLDER,
  TAX_STATE_OPTIONS,
  TAX_STATE_PLACEHOLDER,
} from '../constant';
import { FormSelectField, FormTextInput } from './form';

export interface TaxCodeFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: TaxCreateDto, isActive: boolean) => void;
  open: boolean;
  tax: TaxSummaryDto | null;
}

export function TaxCodeFormDialog({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  tax,
}: TaxCodeFormDialogProps) {
  const isEdit = tax != null;
  const form = useForm<TaxForm>({
    mode: 'onBlur',
    resolver: zodResolver(taxFormSchema),
    values: tax ? toTaxFormValues(tax) : emptyTaxForm(),
  });

  useEffect(() => {
    if (open) {
      form.reset(tax ? toTaxFormValues(tax) : emptyTaxForm());
    }
  }, [form, open, tax]);

  function handleClear() {
    form.reset(emptyTaxForm());
  }

  function handleSubmit(values: TaxForm) {
    onSubmit(toTaxWriteDto(values, tax), values.isActive);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_TAX_TITLE : CREATE_TAX_TITLE}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit ? EDIT_TAX_DESCRIPTION : CREATE_TAX_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <SectionCard
              className="flex flex-col gap-3"
              padding="comfortable"
              radius="panel"
              tone="soft"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormTextInput<TaxForm>
                  label="Tax Code"
                  name="taxCode"
                  placeholder={TAX_CODE_PLACEHOLDER}
                  required
                />
                <FormTextInput<TaxForm>
                  label="Name"
                  name="name"
                  placeholder={TAX_NAME_PLACEHOLDER}
                />
                <FormTextInput<TaxForm>
                  label="County"
                  name="county"
                  placeholder={TAX_COUNTY_PLACEHOLDER}
                />
                <FormSelectField<TaxForm>
                  label="State"
                  name="regionCode"
                  options={TAX_STATE_OPTIONS}
                  placeholder={TAX_STATE_PLACEHOLDER}
                  required
                />
                <FormSelectField<TaxForm>
                  label="City"
                  name="city"
                  options={TAX_CITY_OPTIONS}
                  placeholder={TAX_CITY_PLACEHOLDER}
                />
                <Controller
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <div className="flex items-end pb-1">
                      <SwitchField
                        checked={field.value}
                        label="Active"
                        labelPosition="after"
                        name={field.name}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="mt-8 flex justify-end gap-2">
                <Button
                  disabled={isPending}
                  onClick={handleClear}
                  type="button"
                  variant="outline"
                >
                  Clear
                </Button>
                <Button loading={isPending} type="submit">
                  Save Tax Rate
                </Button>
              </div>
            </SectionCard>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
