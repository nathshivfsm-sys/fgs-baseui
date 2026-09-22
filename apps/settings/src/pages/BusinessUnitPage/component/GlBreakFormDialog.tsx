import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyGlBreakForm,
  glBreakFormSchema,
  toGlBreakFormValues,
  toGlBreakWriteDto,
  type GlBreakForm,
} from '@cms/settings-data-access';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SwitchField,
} from '@cms/ui';
import { FormTextInput } from '../../../shared/component';
import { useGeoLookupOptions } from '../../../shared';
import {
  ADDRESS_LINE_1_PLACEHOLDER,
  ADDRESS_LINE_2_PLACEHOLDER,
  ATTACH_TRADES_PLACEHOLDER,
  CITY_PLACEHOLDER,
  CODE_PLACEHOLDER,
  COUNTRY_PLACEHOLDER,
  CREATE_BREAK_TWO_DESCRIPTION,
  CREATE_BREAK_TWO_TITLE,
  CREATE_BUSINESS_UNIT_DESCRIPTION,
  CREATE_BUSINESS_UNIT_TITLE,
  EDIT_BREAK_TWO_DESCRIPTION,
  EDIT_BREAK_TWO_TITLE,
  EDIT_BUSINESS_UNIT_DESCRIPTION,
  EDIT_BUSINESS_UNIT_TITLE,
  INVOICE_TEMPLATE_OPTIONS,
  INVOICE_TEMPLATE_PLACEHOLDER,
  NAME_PLACEHOLDER,
  POSTAL_CODE_PLACEHOLDER,
  SAVE_BREAK_TWO_LABEL,
  SAVE_BUSINESS_UNIT_LABEL,
  STATE_PLACEHOLDER,
} from '../constant';
import type { GlBreakFormDialogProps } from '../types';
import { FormMultiSelectField, FormSelectField } from './form';

const dialogCopy = {
  'business-units': {
    createTitle: CREATE_BUSINESS_UNIT_TITLE,
    createDescription: CREATE_BUSINESS_UNIT_DESCRIPTION,
    editTitle: EDIT_BUSINESS_UNIT_TITLE,
    editDescription: EDIT_BUSINESS_UNIT_DESCRIPTION,
    nameLabel: 'Business Unit Name',
    saveLabel: SAVE_BUSINESS_UNIT_LABEL,
  },
  'break-2': {
    createTitle: CREATE_BREAK_TWO_TITLE,
    createDescription: CREATE_BREAK_TWO_DESCRIPTION,
    editTitle: EDIT_BREAK_TWO_TITLE,
    editDescription: EDIT_BREAK_TWO_DESCRIPTION,
    nameLabel: 'Name',
    saveLabel: SAVE_BREAK_TWO_LABEL,
  },
} as const;

export const GlBreakFormDialog = ({
  breakLevel,
  catalog,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  queryClient,
  record,
  tradeOptions,
}: GlBreakFormDialogProps) => {
  const isEdit = record != null;
  const copy = dialogCopy[catalog];
  const form = useForm<GlBreakForm>({
    mode: 'onBlur',
    resolver: zodResolver(glBreakFormSchema),
    values: record ? toGlBreakFormValues(record) : emptyGlBreakForm(),
  });
  const country = form.watch('country');
  const state = form.watch('state');
  const { cityOptions, countryOptions, stateOptions } = useGeoLookupOptions(
    queryClient,
    {
      countryCode: country,
      enabled: open,
      includeCities: true,
      stateProvinceCode: state,
    },
  );

  useEffect(() => {
    if (open) {
      form.reset(record ? toGlBreakFormValues(record) : emptyGlBreakForm());
    }
  }, [form, open, record]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: GlBreakForm) => {
    onSubmit({
      body: toGlBreakWriteDto(values, breakLevel),
      isActive: values.isActive,
    });
  };

  const handleCountryChange = () => {
    form.setValue('state', '', { shouldDirty: true, shouldValidate: true });
    form.setValue('city', '', { shouldDirty: true, shouldValidate: true });
  };

  const handleStateChange = () => {
    form.setValue('city', '', { shouldDirty: true, shouldValidate: true });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? copy.editTitle : copy.createTitle}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {isEdit ? copy.editDescription : copy.createDescription}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-5"
            noValidate
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormTextInput<GlBreakForm>
                label={copy.nameLabel}
                name="name"
                placeholder={NAME_PLACEHOLDER}
                required
              />
              <FormTextInput<GlBreakForm>
                label="Code"
                name="code"
                placeholder={CODE_PLACEHOLDER}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormMultiSelectField<GlBreakForm>
                label="Attach Trades"
                name="tradeCodes"
                options={tradeOptions}
                placeholder={ATTACH_TRADES_PLACEHOLDER}
              />
              <FormSelectField<GlBreakForm>
                label="Invoice Template"
                name="breakLabel"
                options={INVOICE_TEMPLATE_OPTIONS}
                placeholder={INVOICE_TEMPLATE_PLACEHOLDER}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormTextInput<GlBreakForm>
                label="Address Line 1"
                name="addressLine1"
                placeholder={ADDRESS_LINE_1_PLACEHOLDER}
                required
              />
              <FormTextInput<GlBreakForm>
                label="Address Line 2"
                name="addressLine2"
                placeholder={ADDRESS_LINE_2_PLACEHOLDER}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormTextInput<GlBreakForm>
                label="Zip/Postal Code"
                name="postalCode"
                placeholder={POSTAL_CODE_PLACEHOLDER}
                required
              />
              <FormSelectField<GlBreakForm>
                disabled={!state}
                label="City"
                name="city"
                options={cityOptions}
                placeholder={CITY_PLACEHOLDER}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelectField<GlBreakForm>
                label="Country"
                name="country"
                onValueChange={handleCountryChange}
                options={countryOptions}
                placeholder={COUNTRY_PLACEHOLDER}
                required
              />
              <FormSelectField<GlBreakForm>
                disabled={!country}
                label="State/Province"
                name="state"
                onValueChange={handleStateChange}
                options={stateOptions}
                placeholder={STATE_PLACEHOLDER}
                required
              />
            </div>
            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <SwitchField
                  checked={field.value}
                  label="Active"
                  labelPosition="after"
                  name={field.name}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button
                disabled={isPending}
                onClick={handleClose}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button loading={isPending} type="submit">
                {copy.saveLabel}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
