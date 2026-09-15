import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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
  SectionCard,
} from '@cms/ui';
import { FormTextInput } from '../../../shared/component';
import {
  ADDRESS_LINE_PLACEHOLDER,
  CITY_PLACEHOLDER,
  CODE_PLACEHOLDER,
  CREATE_BREAK_TWO_DESCRIPTION,
  CREATE_BREAK_TWO_TITLE,
  CREATE_BUSINESS_UNIT_DESCRIPTION,
  CREATE_BUSINESS_UNIT_TITLE,
  EDIT_BREAK_TWO_DESCRIPTION,
  EDIT_BREAK_TWO_TITLE,
  EDIT_BUSINESS_UNIT_DESCRIPTION,
  EDIT_BUSINESS_UNIT_TITLE,
  INVOICE_TEMPLATE_PLACEHOLDER,
  NAME_PLACEHOLDER,
  POSTAL_CODE_PLACEHOLDER,
  STATE_PLACEHOLDER,
} from '../constant';
import type { GlBreakFormDialogProps } from '../types';

const dialogCopy = {
  'business-units': {
    createTitle: CREATE_BUSINESS_UNIT_TITLE,
    createDescription: CREATE_BUSINESS_UNIT_DESCRIPTION,
    editTitle: EDIT_BUSINESS_UNIT_TITLE,
    editDescription: EDIT_BUSINESS_UNIT_DESCRIPTION,
    nameLabel: 'Business Unit',
  },
  'break-2': {
    createTitle: CREATE_BREAK_TWO_TITLE,
    createDescription: CREATE_BREAK_TWO_DESCRIPTION,
    editTitle: EDIT_BREAK_TWO_TITLE,
    editDescription: EDIT_BREAK_TWO_DESCRIPTION,
    nameLabel: 'Name',
  },
} as const;

export const GlBreakFormDialog = ({
  breakLevel,
  catalog,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  record,
}: GlBreakFormDialogProps) => {
  const isEdit = record != null;
  const copy = dialogCopy[catalog];
  const form = useForm<GlBreakForm>({
    mode: 'onBlur',
    resolver: zodResolver(glBreakFormSchema),
    values: record ? toGlBreakFormValues(record) : emptyGlBreakForm(),
  });

  useEffect(() => {
    if (open) {
      form.reset(record ? toGlBreakFormValues(record) : emptyGlBreakForm());
    }
  }, [form, open, record]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: GlBreakForm) => {
    onSubmit(toGlBreakWriteDto(values, breakLevel));
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
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <SectionCard
              className="flex flex-col gap-3"
              padding="comfortable"
              radius="panel"
              tone="soft"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormTextInput<GlBreakForm>
                  label="Code"
                  name="code"
                  placeholder={CODE_PLACEHOLDER}
                  required
                />
                <FormTextInput<GlBreakForm>
                  label={copy.nameLabel}
                  name="name"
                  placeholder={NAME_PLACEHOLDER}
                  required
                />
              </div>
              <FormTextInput<GlBreakForm>
                label="Invoice Template"
                name="breakLabel"
                placeholder={INVOICE_TEMPLATE_PLACEHOLDER}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormTextInput<GlBreakForm>
                  label="Address line 1"
                  name="addressLine1"
                  placeholder={ADDRESS_LINE_PLACEHOLDER}
                />
                <FormTextInput<GlBreakForm>
                  label="Address line 2"
                  name="addressLine2"
                  placeholder={ADDRESS_LINE_PLACEHOLDER}
                />
                <FormTextInput<GlBreakForm>
                  label="City"
                  name="city"
                  placeholder={CITY_PLACEHOLDER}
                />
                <FormTextInput<GlBreakForm>
                  label="State"
                  name="state"
                  placeholder={STATE_PLACEHOLDER}
                />
                <FormTextInput<GlBreakForm>
                  label="Postal code"
                  name="postalCode"
                  placeholder={POSTAL_CODE_PLACEHOLDER}
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
};
