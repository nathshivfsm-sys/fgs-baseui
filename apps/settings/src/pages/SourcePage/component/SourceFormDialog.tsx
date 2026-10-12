import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptySourceForm,
  sourceFormSchema,
  toSourceFormValues,
  type SourceForm,
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
  CREATE_SOURCE_SUBMIT_LABEL,
  CREATE_SOURCE_SUBTITLE,
  CREATE_SOURCE_TITLE,
  EDIT_SOURCE_TITLE,
  SAVE_CHANGES_LABEL,
  SOURCE_DESCRIPTION_PLACEHOLDER,
  SOURCE_NAME_PLACEHOLDER,
} from '../constant';
import type { SourceFormDialogProps } from '../types';
import { SourceDiscardDialog } from './SourceDiscardDialog';
import { FormToggleField } from './form';

const EMPTY_FORM = emptySourceForm();

export const SourceFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  source,
}: SourceFormDialogProps) => {
  const isEdit = source != null;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<SourceForm>({
    mode: 'onBlur',
    resolver: zodResolver(sourceFormSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (open) {
      form.reset(source ? toSourceFormValues(source) : EMPTY_FORM);
      setDiscardOpen(false);
    }
  }, [form, open, source]);

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
    form.reset(source ? toSourceFormValues(source) : EMPTY_FORM);
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: SourceForm) => {
    onSubmit(values);
  };

  const submitLabel = isEdit ? SAVE_CHANGES_LABEL : CREATE_SOURCE_SUBMIT_LABEL;

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-4 p-5 sm:max-w-2xl">
          <DialogHeader className="gap-0.5">
            <DialogTitle className="text-title font-bold">
              {isEdit ? EDIT_SOURCE_TITLE : CREATE_SOURCE_TITLE}
            </DialogTitle>
            <BodySmall color="foreground-subtle">
              {CREATE_SOURCE_SUBTITLE}
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
                <FormTextInput<SourceForm>
                  label="Source Name"
                  name="sourceName"
                  placeholder={SOURCE_NAME_PLACEHOLDER}
                  required
                />
                <FormTextarea<SourceForm>
                  label="Description"
                  name="description"
                  placeholder={SOURCE_DESCRIPTION_PLACEHOLDER}
                  rows={3}
                />
                <FormToggleField<SourceForm>
                  description={ACTIVE_TOGGLE_HELP}
                  label={ACTIVE_TOGGLE_LABEL}
                  name="isActive"
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
                  {submitLabel}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <SourceDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
