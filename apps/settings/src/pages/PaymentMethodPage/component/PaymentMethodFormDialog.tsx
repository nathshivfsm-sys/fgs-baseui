import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyPaymentMethodForm,
  paymentMethodFormSchema,
  toPaymentMethodFormValues,
  type PaymentMethodForm,
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
  ACTIVE_TOGGLE_HELP,
  ACTIVE_TOGGLE_LABEL,
  CREATE_PAYMENT_METHOD_SUBMIT_LABEL,
  CREATE_PAYMENT_METHOD_SUBTITLE,
  CREATE_PAYMENT_METHOD_TITLE,
  EDIT_PAYMENT_METHOD_TITLE,
  FIELD_TECH_TOGGLE_HELP,
  FIELD_TECH_TOGGLE_LABEL,
  PAYMENT_METHOD_NAME_PLACEHOLDER,
  SAVE_CHANGES_LABEL,
} from '../constant';
import type { PaymentMethodFormDialogProps } from '../types';
import { PaymentMethodDiscardDialog } from './PaymentMethodDiscardDialog';
import { FormToggleField } from './form';

const EMPTY_FORM = emptyPaymentMethodForm();

export const PaymentMethodFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  paymentMethod,
}: PaymentMethodFormDialogProps) => {
  const isEdit = paymentMethod != null;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<PaymentMethodForm>({
    mode: 'onChange',
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: EMPTY_FORM,
  });
  const name = form.watch('displayName');
  const canSubmit = name.trim().length > 0;

  useEffect(() => {
    if (open) {
      form.reset(
        paymentMethod ? toPaymentMethodFormValues(paymentMethod) : EMPTY_FORM,
      );
      setDiscardOpen(false);
    }
  }, [form, open, paymentMethod]);

  const closeForm = () => {
    onOpenChange(false);
  };

  const requestClose = () => {
    if (form.formState.isDirty) {
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
    form.reset(
      paymentMethod ? toPaymentMethodFormValues(paymentMethod) : EMPTY_FORM,
    );
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: PaymentMethodForm) => {
    onSubmit(values);
  };

  const submitLabel = isEdit
    ? SAVE_CHANGES_LABEL
    : CREATE_PAYMENT_METHOD_SUBMIT_LABEL;

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-4 p-5 sm:max-w-2xl">
          <DialogHeader className="gap-0.5">
            <DialogTitle className="text-title font-bold">
              {isEdit ? EDIT_PAYMENT_METHOD_TITLE : CREATE_PAYMENT_METHOD_TITLE}
            </DialogTitle>
            <BodySmall color="foreground-subtle">
              {CREATE_PAYMENT_METHOD_SUBTITLE}
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
                <FormTextInput<PaymentMethodForm>
                  label="Name"
                  name="displayName"
                  placeholder={PAYMENT_METHOD_NAME_PLACEHOLDER}
                  required
                />
                <FormToggleField<PaymentMethodForm>
                  description={FIELD_TECH_TOGGLE_HELP}
                  label={FIELD_TECH_TOGGLE_LABEL}
                  name="isMobileVisible"
                />
                {isEdit ? (
                  <FormToggleField<PaymentMethodForm>
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
      <PaymentMethodDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
