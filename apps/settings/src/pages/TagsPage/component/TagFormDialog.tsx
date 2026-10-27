import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyTagForm,
  tagFormSchema,
  toTagFormValues,
  type TagForm,
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
import { FormTextInput, FormTextarea } from '../../../shared/component/form';
import {
  CREATE_TAG_SUBMIT_LABEL,
  CREATE_TAG_TITLE,
  EDIT_TAG_TITLE,
  ENTITY_PLACEHOLDER,
  SAVE_CHANGES_LABEL,
  TAG_DESCRIPTION_PLACEHOLDER,
  TAG_ENTITY_OPTIONS,
  TAG_NAME_PLACEHOLDER,
} from '../constant';
import type { TagFormDialogProps } from '../types';
import { TagDiscardDialog } from './TagDiscardDialog';
import { FormColorInput, FormSelectField, FormSwitchField } from './form';

const EMPTY_FORM = emptyTagForm();
const ENTITY_OPTIONS = [
  { label: 'All entities', value: '' },
  ...TAG_ENTITY_OPTIONS,
];

export const TagFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  tag,
}: TagFormDialogProps) => {
  const isEdit = tag != null;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<TagForm>({
    mode: 'onBlur',
    resolver: zodResolver(tagFormSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (open) {
      form.reset(tag ? toTagFormValues(tag) : EMPTY_FORM);
      setDiscardOpen(false);
    }
  }, [form, open, tag]);

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
    form.reset(tag ? toTagFormValues(tag) : EMPTY_FORM);
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: TagForm) => {
    onSubmit(values);
  };

  const submitLabel = isEdit ? SAVE_CHANGES_LABEL : CREATE_TAG_SUBMIT_LABEL;

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-6 p-5 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-title font-bold">
              {isEdit ? EDIT_TAG_TITLE : CREATE_TAG_TITLE}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {isEdit
                ? 'Tag name, entity scope, description, colors, and active status.'
                : 'Tag name, entity scope, description, and colors.'}
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
                  <FormTextInput<TagForm>
                    label="Name"
                    name="name"
                    placeholder={TAG_NAME_PLACEHOLDER}
                    required
                  />
                  <FormSelectField<TagForm>
                    label="Entity"
                    name="entity"
                    options={ENTITY_OPTIONS}
                    placeholder={ENTITY_PLACEHOLDER}
                  />
                </div>
                <FormTextarea<TagForm>
                  label="Description"
                  name="description"
                  placeholder={TAG_DESCRIPTION_PLACEHOLDER}
                  rows={3}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormColorInput<TagForm>
                    fallback="#D9D9D9"
                    label="Background Color"
                    name="backgroundColor"
                  />
                  <FormColorInput<TagForm>
                    fallback="#374151"
                    label="Text Color"
                    name="textColor"
                  />
                </div>
                {isEdit ? <FormSwitchField<TagForm> name="isActive" /> : null}
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
              </SectionCard>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <TagDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
