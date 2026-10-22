import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptySalesActivityTypeForm,
  salesActivityTypeFormSchema,
  toSalesActivityTypeFormValues,
  type SalesActivityTypeForm,
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
  ACTIVITY_CODE_LABEL,
  ACTIVITY_CODE_PLACEHOLDER,
  ACTIVITY_DESCRIPTION_PLACEHOLDER,
  ACTIVITY_FORM_SUBTITLE,
  ACTIVITY_NAME_LABEL,
  ACTIVITY_NAME_PLACEHOLDER,
  CREATE_ACTIVITY_SUBMIT_LABEL,
  CREATE_ACTIVITY_TITLE,
  EDIT_ACTIVITY_TITLE,
  MANUAL_SELECTION_LABEL,
  SAVE_CHANGES_LABEL,
} from '../constant';
import type { SalesActivityFormDialogProps } from '../types';
import { SalesActivityDiscardDialog } from './SalesActivityDiscardDialog';
import { FormAppliesToField, FormToggleField } from './form';

const EMPTY_FORM = emptySalesActivityTypeForm();

export const SalesActivityFormDialog = ({
  activity,
  isPending,
  onOpenChange,
  onSubmit,
  open,
}: SalesActivityFormDialogProps) => {
  const isEdit = activity != null;
  const lockCode = isEdit && activity.isSystem;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<SalesActivityTypeForm>({
    mode: 'onBlur',
    resolver: zodResolver(salesActivityTypeFormSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        activity ? toSalesActivityTypeFormValues(activity) : EMPTY_FORM,
      );
      setDiscardOpen(false);
    }
  }, [activity, form, open]);

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
    form.reset(activity ? toSalesActivityTypeFormValues(activity) : EMPTY_FORM);
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: SalesActivityTypeForm) => {
    onSubmit(values);
  };

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-4 p-5 sm:max-w-2xl">
          <DialogHeader className="gap-0.5">
            <DialogTitle className="text-title font-semibold">
              {isEdit ? EDIT_ACTIVITY_TITLE : CREATE_ACTIVITY_TITLE}
            </DialogTitle>
            <BodySmall color="foreground-subtle">
              {ACTIVITY_FORM_SUBTITLE}
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
                  <FormTextInput<SalesActivityTypeForm>
                    disabled={lockCode}
                    label={ACTIVITY_CODE_LABEL}
                    name="activityTypeCode"
                    placeholder={ACTIVITY_CODE_PLACEHOLDER}
                    required
                  />
                  <FormTextInput<SalesActivityTypeForm>
                    label={ACTIVITY_NAME_LABEL}
                    name="activityTypeName"
                    placeholder={ACTIVITY_NAME_PLACEHOLDER}
                    required
                  />
                </div>
                <FormTextarea<SalesActivityTypeForm>
                  label="Description"
                  name="description"
                  placeholder={ACTIVITY_DESCRIPTION_PLACEHOLDER}
                  rows={3}
                />
                <FormAppliesToField />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <FormToggleField<SalesActivityTypeForm>
                    label={MANUAL_SELECTION_LABEL}
                    name="allowManualSelection"
                  />
                  <FormToggleField<SalesActivityTypeForm>
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
                  {isEdit ? SAVE_CHANGES_LABEL : CREATE_ACTIVITY_SUBMIT_LABEL}
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
