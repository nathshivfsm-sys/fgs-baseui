import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  emptyPostalCodeForm,
  toPostalCodeFormValues,
  toPostalCodeWriteDto,
  postalCodeFormSchema,
  type PostalCodeForm,
} from '@cms/settings-data-access';
import type {
  PostalCodeCreateDto,
  PostalCodeSummaryDto,
} from '@cms/settings-contract';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SectionCard,
  type SelectOption,
} from '@cms/ui';
import {
  CREATE_POSTAL_DESCRIPTION,
  CREATE_POSTAL_TITLE,
  EDIT_POSTAL_DESCRIPTION,
  EDIT_POSTAL_TITLE,
  POSTAL_CITY_OPTIONS,
  POSTAL_CITY_PLACEHOLDER,
  POSTAL_CODE_PLACEHOLDER,
  POSTAL_STATE_OPTIONS,
  POSTAL_STATE_PLACEHOLDER,
  POSTAL_TAX_PLACEHOLDER,
  POSTAL_TRIP_CHARGE_PLACEHOLDER,
  POSTAL_ZONE_PLACEHOLDER,
} from '../constant';
import { FormSelectField, FormTextInput } from './form';

export interface PostalCodeFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: PostalCodeCreateDto) => void;
  open: boolean;
  postalCode: PostalCodeSummaryDto | null;
  taxOptions: readonly SelectOption[];
  zoneOptions: readonly SelectOption[];
}

export function PostalCodeFormDialog({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  postalCode,
  taxOptions,
  zoneOptions,
}: PostalCodeFormDialogProps) {
  const isEdit = postalCode != null;
  const form = useForm<PostalCodeForm>({
    mode: 'onBlur',
    resolver: zodResolver(postalCodeFormSchema),
    values: postalCode
      ? toPostalCodeFormValues(postalCode)
      : emptyPostalCodeForm(),
  });

  useEffect(() => {
    if (open) {
      form.reset(
        postalCode ? toPostalCodeFormValues(postalCode) : emptyPostalCodeForm(),
      );
    }
  }, [form, open, postalCode]);

  function handleClose() {
    onOpenChange(false);
  }

  function handleSubmit(values: PostalCodeForm) {
    onSubmit(toPostalCodeWriteDto(values));
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_POSTAL_TITLE : CREATE_POSTAL_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {isEdit ? EDIT_POSTAL_DESCRIPTION : CREATE_POSTAL_DESCRIPTION}
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
                <FormTextInput<PostalCodeForm>
                  label="Postal Code"
                  name="postalCode"
                  placeholder={POSTAL_CODE_PLACEHOLDER}
                  required
                />
                <FormSelectField<PostalCodeForm>
                  label="City"
                  name="city"
                  options={POSTAL_CITY_OPTIONS}
                  placeholder={POSTAL_CITY_PLACEHOLDER}
                  required
                />
                <FormSelectField<PostalCodeForm>
                  label="State"
                  name="state"
                  options={POSTAL_STATE_OPTIONS}
                  placeholder={POSTAL_STATE_PLACEHOLDER}
                />
                <FormSelectField<PostalCodeForm>
                  label="Zone"
                  name="fgsSetupZoneId"
                  options={zoneOptions}
                  placeholder={POSTAL_ZONE_PLACEHOLDER}
                />
                <FormSelectField<PostalCodeForm>
                  label="Tax Code"
                  name="fgsSetupTaxId"
                  options={taxOptions}
                  placeholder={POSTAL_TAX_PLACEHOLDER}
                  required
                />
                <FormTextInput<PostalCodeForm>
                  inputMode="decimal"
                  label="Trip Charge"
                  name="tripCharge"
                  placeholder={POSTAL_TRIP_CHARGE_PLACEHOLDER}
                />
              </div>
              <div className="mt-8 flex justify-end gap-2">
                <Button
                  disabled={isPending}
                  onClick={handleClose}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button loading={isPending} type="submit">
                  Save
                </Button>
              </div>
            </SectionCard>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
