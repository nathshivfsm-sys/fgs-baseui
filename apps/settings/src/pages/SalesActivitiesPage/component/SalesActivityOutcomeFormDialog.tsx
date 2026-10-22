import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptySalesActivityOutcomeForm,
  salesActivityOutcomeFormSchema,
  toSalesActivityOutcomeFormValues,
  type SalesActivityOutcomeForm,
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
  ACTIVE_LABEL,
  CREATE_OUTCOME_SUBMIT_LABEL,
  CREATE_OUTCOME_TITLE,
  EDIT_OUTCOME_TITLE,
  MANUAL_SELECTION_LABEL,
  NEXT_STATUS_LABEL,
  NEXT_STATUS_PLACEHOLDER,
  OUTCOME_CODE_LABEL,
  OUTCOME_CODE_PLACEHOLDER,
  OUTCOME_DESCRIPTION_PLACEHOLDER,
  OUTCOME_FORM_SUBTITLE,
  OUTCOME_NAME_LABEL,
  OUTCOME_NAME_PLACEHOLDER,
  REQUIRED_COMMENT_LABEL,
  SAVE_CHANGES_LABEL,
  TERMINAL_LABEL,
} from '../constant';
import type { SalesActivityOutcomeFormDialogProps } from '../types';
import { SalesActivityDiscardDialog } from './SalesActivityDiscardDialog';
import { FormAppliesToField, FormSelectField, FormToggleField } from './form';

const EMPTY_FORM = emptySalesActivityOutcomeForm();

export const SalesActivityOutcomeFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  outcome,
  statusOptions,
}: SalesActivityOutcomeFormDialogProps) => {
  const isEdit = outcome != null;
  const lockCode = isEdit && outcome.isSystem;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<SalesActivityOutcomeForm>({
    mode: 'onBlur',
    resolver: zodResolver(salesActivityOutcomeFormSchema),
    defaultValues: EMPTY_FORM,
  });

  const nextStatusOptions = useMemo(() => {
    const options = statusOptions.map((status) => ({
      value: String(status.id),
      label:
        status.statusCode?.trim() ||
        status.statusName?.trim() ||
        String(status.id),
    }));
    const selected = outcome?.nextSalesPipelineStatusId;
    if (
      selected != null &&
      !options.some((option) => option.value === String(selected))
    ) {
      options.unshift({ value: String(selected), label: String(selected) });
    }
    return options;
  }, [outcome?.nextSalesPipelineStatusId, statusOptions]);

  useEffect(() => {
    if (open) {
      form.reset(
        outcome ? toSalesActivityOutcomeFormValues(outcome) : EMPTY_FORM,
      );
      setDiscardOpen(false);
    }
  }, [form, open, outcome]);

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
      outcome ? toSalesActivityOutcomeFormValues(outcome) : EMPTY_FORM,
    );
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: SalesActivityOutcomeForm) => {
    onSubmit(values);
  };

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-4 p-5 sm:max-w-2xl">
          <DialogHeader className="gap-0.5">
            <DialogTitle className="text-title font-semibold">
              {isEdit ? EDIT_OUTCOME_TITLE : CREATE_OUTCOME_TITLE}
            </DialogTitle>
            <BodySmall color="foreground-subtle">
              {OUTCOME_FORM_SUBTITLE}
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
                  <FormTextInput<SalesActivityOutcomeForm>
                    disabled={lockCode}
                    label={OUTCOME_CODE_LABEL}
                    name="outcomeCode"
                    placeholder={OUTCOME_CODE_PLACEHOLDER}
                    required
                  />
                  <FormTextInput<SalesActivityOutcomeForm>
                    label={OUTCOME_NAME_LABEL}
                    name="outcomeName"
                    placeholder={OUTCOME_NAME_PLACEHOLDER}
                    required
                  />
                </div>
                <FormTextarea<SalesActivityOutcomeForm>
                  label="Description"
                  name="description"
                  placeholder={OUTCOME_DESCRIPTION_PLACEHOLDER}
                  rows={3}
                />
                <FormSelectField<SalesActivityOutcomeForm>
                  label={NEXT_STATUS_LABEL}
                  name="nextSalesPipelineStatusId"
                  options={nextStatusOptions}
                  placeholder={NEXT_STATUS_PLACEHOLDER}
                />
                <FormAppliesToField />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <FormToggleField<SalesActivityOutcomeForm>
                    label={MANUAL_SELECTION_LABEL}
                    name="allowManualSelection"
                  />
                  <FormToggleField<SalesActivityOutcomeForm>
                    label={TERMINAL_LABEL}
                    name="isTerminal"
                  />
                  <FormToggleField<SalesActivityOutcomeForm>
                    label={REQUIRED_COMMENT_LABEL}
                    name="requireComment"
                  />
                  <FormToggleField<SalesActivityOutcomeForm>
                    label={ACTIVE_LABEL}
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
                  {isEdit ? SAVE_CHANGES_LABEL : CREATE_OUTCOME_SUBMIT_LABEL}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <SalesActivityDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
