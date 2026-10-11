import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptySetupDescriptionForm,
  setupDescriptionFormSchema,
  toSetupDescriptionFormValues,
  type SetupDescriptionForm,
} from '@cms/settings-data-access';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  SectionCard,
  type SelectOption,
} from '@cms/ui';
import { FormTextInput, FormTextarea } from '../../../shared/component/form';
import {
  DESCRIPTION_PLACEHOLDER,
  SAVE_LABEL,
  TITLE_PLACEHOLDER,
  TRADE_PLACEHOLDER,
} from '../constant';
import type { StandardDescriptionFormDialogProps } from '../types';
import { FormSelectField } from './form';
import { StandardDescriptionDiscardDialog } from './StandardDescriptionDiscardDialog';

const EMPTY_FORM = emptySetupDescriptionForm();

export const StandardDescriptionFormDialog = ({
  descriptionTypeLabel,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  record,
  showTradeField,
  tradeOptions,
}: StandardDescriptionFormDialogProps) => {
  const isEdit = record != null;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<SetupDescriptionForm>({
    mode: 'onBlur',
    resolver: zodResolver(setupDescriptionFormSchema),
    defaultValues: EMPTY_FORM,
  });

  const tradeSelectOptions: readonly SelectOption[] = [
    { label: TRADE_PLACEHOLDER, value: '' },
    ...tradeOptions.map((option) => ({
      value: String(option.id),
      label: option.label,
    })),
  ];

  useEffect(() => {
    if (open) {
      form.reset(record ? toSetupDescriptionFormValues(record) : EMPTY_FORM);
      setDiscardOpen(false);
    }
  }, [form, open, record]);

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
    form.reset(record ? toSetupDescriptionFormValues(record) : EMPTY_FORM);
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: SetupDescriptionForm) => {
    onSubmit(values);
  };

  const title = isEdit
    ? `Edit ${descriptionTypeLabel}`
    : `Add ${descriptionTypeLabel}`;

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-4 p-5 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-title font-bold">{title}</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
              <SectionCard
                className="flex flex-col gap-4"
                padding="comfortable"
                radius="panel"
                tone="soft"
              >
                <div
                  className={
                    showTradeField
                      ? 'grid grid-cols-1 gap-3 sm:grid-cols-2'
                      : 'grid grid-cols-1 gap-3'
                  }
                >
                  <FormTextInput<SetupDescriptionForm>
                    label="Title"
                    name="title"
                    placeholder={TITLE_PLACEHOLDER}
                    required
                  />
                  {showTradeField ? (
                    <FormSelectField<SetupDescriptionForm>
                      label="Trade"
                      name="tradeId"
                      options={tradeSelectOptions}
                      placeholder={TRADE_PLACEHOLDER}
                    />
                  ) : null}
                </div>
                <FormTextarea<SetupDescriptionForm>
                  label="Description"
                  name="body"
                  placeholder={DESCRIPTION_PLACEHOLDER}
                  required
                  rows={4}
                />
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
                <Button loading={isPending} type="submit">
                  {SAVE_LABEL}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <StandardDescriptionDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
