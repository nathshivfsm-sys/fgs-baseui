import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyResolutionCodeForm,
  resolutionCodeFormSchema,
  toResolutionCodeFormValues,
  type ResolutionCodeForm,
} from '@cms/settings-data-access';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  SectionCard,
} from '@cms/ui';
import { FormTextInput } from '../../../shared/component/form';
import {
  CREATE_RESOLUTION_CODE_TITLE,
  EDIT_RESOLUTION_CODE_TITLE,
  RESOLUTION_CODE_PLACEHOLDER,
  RESOLUTION_NAME_PLACEHOLDER,
  RESOLUTION_TYPE_OPTIONS,
  RESOLUTION_TYPE_PLACEHOLDER,
  SAVE_LABEL,
} from '../constant';
import type { ResolutionCodeFormDialogProps } from '../types';
import { FormSelectField, FormToggleField } from './form';
import { ResolutionCodeDiscardDialog } from './ResolutionCodeDiscardDialog';

const EMPTY_FORM = emptyResolutionCodeForm();

export const ResolutionCodeFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  resolutionCode,
}: ResolutionCodeFormDialogProps) => {
  const isEdit = resolutionCode != null;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<ResolutionCodeForm>({
    mode: 'onBlur',
    resolver: zodResolver(resolutionCodeFormSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        resolutionCode
          ? toResolutionCodeFormValues(resolutionCode)
          : EMPTY_FORM,
      );
      setDiscardOpen(false);
    }
  }, [form, open, resolutionCode]);

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
      resolutionCode ? toResolutionCodeFormValues(resolutionCode) : EMPTY_FORM,
    );
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: ResolutionCodeForm) => {
    onSubmit(values);
  };

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-4 p-5 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-title font-bold">
              {isEdit
                ? EDIT_RESOLUTION_CODE_TITLE
                : CREATE_RESOLUTION_CODE_TITLE}
            </DialogTitle>
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
                  <FormTextInput<ResolutionCodeForm>
                    label="Resolution Code"
                    name="resolutionCode"
                    placeholder={RESOLUTION_CODE_PLACEHOLDER}
                    required
                  />
                  <FormTextInput<ResolutionCodeForm>
                    label="Resolution Name"
                    name="resolutionName"
                    placeholder={RESOLUTION_NAME_PLACEHOLDER}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2">
                  <FormSelectField<ResolutionCodeForm>
                    label="Resolution Type"
                    name="typeId"
                    options={RESOLUTION_TYPE_OPTIONS}
                    placeholder={RESOLUTION_TYPE_PLACEHOLDER}
                    required
                  />
                  <FormToggleField<ResolutionCodeForm>
                    label="Mobile Visible"
                    name="isMobileVisible"
                  />
                </div>
              </SectionCard>
              <div className="mt-4 flex justify-between gap-2">
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
      <ResolutionCodeDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
