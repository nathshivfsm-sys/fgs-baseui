import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyPaymentTermForm,
  PAYMENT_TERM_NET_DAYS_METHOD,
  paymentTermDaysAreLocked,
  paymentTermFormSchema,
  toPaymentTermFormValues,
  type PaymentTermForm,
} from '@cms/settings-data-access';
import {
  BodySmall,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  SectionCard,
} from '@cms/ui';
import { FormTextInput } from '../../../shared/component/form';
import {
  ACCOUNT_TYPE_LABEL,
  ACCOUNT_TYPE_OPTIONS,
  ACTIVE_TOGGLE_HELP,
  ACTIVE_TOGGLE_LABEL,
  CREATE_PAYMENT_TERM_SUBMIT_LABEL,
  CREATE_PAYMENT_TERM_SUBTITLE,
  CREATE_PAYMENT_TERM_TITLE,
  DUE_DATE_METHOD_LABEL,
  DUE_DATE_METHOD_OPTIONS,
  EDIT_PAYMENT_TERM_TITLE,
  FIELD_TECH_TOGGLE_HELP,
  FIELD_TECH_TOGGLE_LABEL,
  NUMBER_OF_DAYS_LABEL,
  PAYMENT_TERM_NAME_PLACEHOLDER,
  SAVE_CHANGES_LABEL,
} from '../constant';
import type { PaymentTermFormDialogProps } from '../types';
import { PaymentTermDiscardDialog } from './PaymentTermDiscardDialog';
import { FormDaysField, FormSelectField, FormToggleField } from './form';

const EMPTY_FORM = emptyPaymentTermForm();
const WHOLE_DAYS = /^\d+$/;

export const PaymentTermFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  paymentTerm,
}: PaymentTermFormDialogProps) => {
  const isEdit = paymentTerm != null;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<PaymentTermForm>({
    mode: 'onChange',
    resolver: zodResolver(paymentTermFormSchema),
    defaultValues: EMPTY_FORM,
  });
  const isDirty = form.formState.isDirty;
  const name = form.watch('name');
  const dueDateMethod = form.watch('dueDateMethod');
  const numberOfDays = form.watch('numberOfDays');
  const accountType = form.watch('accountType');
  const daysLocked = paymentTermDaysAreLocked(dueDateMethod);
  const daysReady =
    dueDateMethod !== PAYMENT_TERM_NET_DAYS_METHOD ||
    WHOLE_DAYS.test(numberOfDays.trim());
  const canSubmit =
    name.trim().length > 0 &&
    dueDateMethod.trim().length > 0 &&
    accountType !== '' &&
    daysReady;

  useEffect(() => {
    if (open) {
      form.reset(
        paymentTerm ? toPaymentTermFormValues(paymentTerm) : EMPTY_FORM,
      );
      setDiscardOpen(false);
    }
  }, [form, open, paymentTerm]);

  const closeForm = () => {
    onOpenChange(false);
  };

  const requestClose = () => {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }
    closeForm();
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      onOpenChange(true);
      return;
    }
    requestClose();
  };

  const handleCancel = () => {
    requestClose();
  };

  const handleDiscardConfirm = () => {
    setDiscardOpen(false);
    form.reset(paymentTerm ? toPaymentTermFormValues(paymentTerm) : EMPTY_FORM);
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleDueDateMethodChange = (value: string) => {
    if (paymentTermDaysAreLocked(value)) {
      form.setValue('numberOfDays', '0', {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }
    if (
      value === PAYMENT_TERM_NET_DAYS_METHOD &&
      form.getValues('numberOfDays') === '0'
    ) {
      form.setValue('numberOfDays', '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handleSubmit = (values: PaymentTermForm) => {
    onSubmit(values);
  };

  const submitLabel = isEdit
    ? SAVE_CHANGES_LABEL
    : CREATE_PAYMENT_TERM_SUBMIT_LABEL;

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-4 p-5 sm:max-w-2xl">
          <DialogHeader className="gap-0.5">
            <DialogTitle className="text-title font-bold">
              {isEdit ? EDIT_PAYMENT_TERM_TITLE : CREATE_PAYMENT_TERM_TITLE}
            </DialogTitle>
            <BodySmall color="foreground-subtle">
              {CREATE_PAYMENT_TERM_SUBTITLE}
            </BodySmall>
          </DialogHeader>
          <FormProvider {...form}>
            <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
              <SectionCard
                className="flex flex-col gap-4"
                padding="comfortable"
                radius="panel"
                tone="soft"
              >
                <FormTextInput<PaymentTermForm>
                  label="Name"
                  name="name"
                  placeholder={PAYMENT_TERM_NAME_PLACEHOLDER}
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormSelectField<PaymentTermForm>
                    label={DUE_DATE_METHOD_LABEL}
                    name="dueDateMethod"
                    onValueChange={handleDueDateMethodChange}
                    options={DUE_DATE_METHOD_OPTIONS}
                    placeholder="Select due date method"
                    required
                  />
                  <FormDaysField<PaymentTermForm>
                    disabled={daysLocked}
                    label={NUMBER_OF_DAYS_LABEL}
                    name="numberOfDays"
                    required={dueDateMethod === PAYMENT_TERM_NET_DAYS_METHOD}
                  />
                </div>
                <FormSelectField<PaymentTermForm>
                  label={ACCOUNT_TYPE_LABEL}
                  name="accountType"
                  options={ACCOUNT_TYPE_OPTIONS}
                  placeholder="Select account type"
                  required
                />
                <FormToggleField<PaymentTermForm>
                  description={FIELD_TECH_TOGGLE_HELP}
                  label={FIELD_TECH_TOGGLE_LABEL}
                  name="isMobileVisible"
                />
                {isEdit ? (
                  <FormToggleField<PaymentTermForm>
                    description={ACTIVE_TOGGLE_HELP}
                    label={ACTIVE_TOGGLE_LABEL}
                    name="isActive"
                  />
                ) : null}
              </SectionCard>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  disabled={isPending}
                  onClick={handleCancel}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!canSubmit || isPending}
                  loading={isPending}
                  type="submit"
                >
                  {submitLabel}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <PaymentTermDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
