import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptySalesPipelineStatusForm,
  salesPipelineStatusFormSchema,
  toSalesPipelineStatusFormValues,
  type SalesPipelineStatusForm,
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
import { FormTextInput, FormTextarea } from '../../../shared/component/form';
import {
  ACTIVE_TOGGLE_HELP,
  ACTIVE_TOGGLE_LABEL,
  APPLIES_TO_LEAD_HELP,
  APPLIES_TO_LEAD_LABEL,
  APPLIES_TO_OPPORTUNITY_HELP,
  APPLIES_TO_OPPORTUNITY_LABEL,
  CREATE_STATUS_SUBMIT_LABEL,
  CREATE_STATUS_SUBTITLE,
  CREATE_STATUS_TITLE,
  DESCRIPTION_PLACEHOLDER,
  EDIT_STATUS_TITLE,
  MANUAL_SELECTION_TOGGLE_HELP,
  MANUAL_SELECTION_TOGGLE_LABEL,
  SAVE_CHANGES_LABEL,
  STATUS_CODE_PLACEHOLDER,
  STATUS_NAME_PLACEHOLDER,
  STATUS_CODE_OPTIONS,
  TERMINAL_TOGGLE_HELP,
  TERMINAL_TOGGLE_LABEL,
} from '../constant';
import type { SalesPipelineStatusFormDialogProps } from '../types';
import { SalesPipelineStatusDiscardDialog } from './SalesPipelineStatusDiscardDialog';
import { FormSelectField, FormToggleField } from './form';

const EMPTY_FORM = emptySalesPipelineStatusForm();

export const SalesPipelineStatusFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  status,
}: SalesPipelineStatusFormDialogProps) => {
  const isEdit = status != null;
  const lockStatusCode = isEdit && status.isSystem;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<SalesPipelineStatusForm>({
    mode: 'onBlur',
    resolver: zodResolver(salesPipelineStatusFormSchema),
    defaultValues: EMPTY_FORM,
  });

  const statusCodeOptions = useMemo(() => {
    const options = STATUS_CODE_OPTIONS.map((option) => ({ ...option }));
    const code = status?.statusCode;
    if (isEdit && code && !options.some((option) => option.value === code)) {
      options.unshift({ value: code, label: code });
    }
    return options;
  }, [isEdit, status?.statusCode]);

  useEffect(() => {
    if (open) {
      form.reset(status ? toSalesPipelineStatusFormValues(status) : EMPTY_FORM);
      setDiscardOpen(false);
    }
  }, [form, open, status]);

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
    form.reset(status ? toSalesPipelineStatusFormValues(status) : EMPTY_FORM);
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: SalesPipelineStatusForm) => {
    onSubmit(values);
  };

  const submitLabel = isEdit ? SAVE_CHANGES_LABEL : CREATE_STATUS_SUBMIT_LABEL;
  const isTerminal = form.watch('isTerminal');

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-4 p-5 sm:max-w-2xl">
          <DialogHeader className="gap-0.5">
            <DialogTitle className="text-title font-bold">
              {isEdit ? EDIT_STATUS_TITLE : CREATE_STATUS_TITLE}
            </DialogTitle>
            <BodySmall color="foreground-subtle">
              {CREATE_STATUS_SUBTITLE}
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormSelectField<SalesPipelineStatusForm>
                    disabled={lockStatusCode}
                    label="Status Code"
                    name="statusCode"
                    options={statusCodeOptions}
                    placeholder={STATUS_CODE_PLACEHOLDER}
                    required
                  />
                  <FormTextInput<SalesPipelineStatusForm>
                    label="Status Name"
                    name="statusName"
                    placeholder={STATUS_NAME_PLACEHOLDER}
                    required
                  />
                </div>
                <FormTextarea<SalesPipelineStatusForm>
                  label="Description"
                  name="description"
                  placeholder={DESCRIPTION_PLACEHOLDER}
                  rows={3}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormToggleField<SalesPipelineStatusForm>
                    description={APPLIES_TO_LEAD_HELP}
                    label={APPLIES_TO_LEAD_LABEL}
                    name="appliesToLead"
                  />
                  <FormToggleField<SalesPipelineStatusForm>
                    description={APPLIES_TO_OPPORTUNITY_HELP}
                    label={APPLIES_TO_OPPORTUNITY_LABEL}
                    name="appliesToOpportunity"
                  />
                  <FormToggleField<SalesPipelineStatusForm>
                    description={TERMINAL_TOGGLE_HELP}
                    label={TERMINAL_TOGGLE_LABEL}
                    muted={!isTerminal}
                    name="isTerminal"
                  />
                  <FormToggleField<SalesPipelineStatusForm>
                    description={MANUAL_SELECTION_TOGGLE_HELP}
                    label={MANUAL_SELECTION_TOGGLE_LABEL}
                    name="allowManualSelection"
                  />
                  <FormToggleField<SalesPipelineStatusForm>
                    description={ACTIVE_TOGGLE_HELP}
                    label={ACTIVE_TOGGLE_LABEL}
                    name="isActive"
                  />
                </div>
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
                  {submitLabel}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <SalesPipelineStatusDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
