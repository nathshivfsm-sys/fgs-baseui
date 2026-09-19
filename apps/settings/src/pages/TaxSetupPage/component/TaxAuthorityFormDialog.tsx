import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  emptyTaxAuthorityForm,
  toTaxAuthorityFormValues,
  toTaxAuthorityWriteDto,
  taxAuthorityFormSchema,
  type TaxAuthorityForm,
} from '@cms/settings-data-access';
import type {
  TaxAuthorityCreateDto,
  TaxAuthoritySummaryDto,
} from '@cms/settings-contract';
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
  AUTHORITY_NAME_PLACEHOLDER,
  AUTHORITY_RATE_PLACEHOLDER,
  CREATE_AUTHORITY_DESCRIPTION,
  CREATE_AUTHORITY_TITLE,
  EDIT_AUTHORITY_DESCRIPTION,
  EDIT_AUTHORITY_TITLE,
} from '../constant';
import { FormTextInput } from './form';

export interface TaxAuthorityFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: TaxAuthorityCreateDto, isActive: boolean) => void;
  open: boolean;
  authority: TaxAuthoritySummaryDto | null;
}

export function TaxAuthorityFormDialog({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  authority,
}: TaxAuthorityFormDialogProps) {
  const isEdit = authority != null;
  const form = useForm<TaxAuthorityForm>({
    mode: 'onBlur',
    resolver: zodResolver(taxAuthorityFormSchema),
    values: authority
      ? toTaxAuthorityFormValues(authority)
      : emptyTaxAuthorityForm(),
  });

  useEffect(() => {
    if (open) {
      form.reset(
        authority
          ? toTaxAuthorityFormValues(authority)
          : emptyTaxAuthorityForm(),
      );
    }
  }, [form, open, authority]);

  function handleClear() {
    form.reset(emptyTaxAuthorityForm());
  }

  function handleSubmit(values: TaxAuthorityForm) {
    onSubmit(toTaxAuthorityWriteDto(values, authority), values.isActive);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_AUTHORITY_TITLE : CREATE_AUTHORITY_TITLE}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit ? EDIT_AUTHORITY_DESCRIPTION : CREATE_AUTHORITY_DESCRIPTION}
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
                <FormTextInput<TaxAuthorityForm>
                  label="Tax Authority"
                  name="name"
                  placeholder={AUTHORITY_NAME_PLACEHOLDER}
                  required
                />
                <FormTextInput<TaxAuthorityForm>
                  inputMode="decimal"
                  label="Rate"
                  name="taxPercent"
                  placeholder={AUTHORITY_RATE_PLACEHOLDER}
                  required
                />
                <FormTextInput<TaxAuthorityForm>
                  label="Effective Date"
                  name="effectiveFromDate"
                  required
                  type="date"
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
