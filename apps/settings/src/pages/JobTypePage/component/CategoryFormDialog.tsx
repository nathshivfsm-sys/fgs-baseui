import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyJobCategoryForm,
  jobCategoryFormSchema,
  toJobCategoryFormValues,
  type JobCategoryForm,
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
import {
  CATEGORY_NAME_PLACEHOLDER,
  CREATE_CATEGORY_TITLE,
  EDIT_CATEGORY_TITLE,
} from '../constant';
import type { CategoryFormDialogProps } from '../types';
import { FormColorInput, FormSwitchField, FormTextInput } from './form';

export const CategoryFormDialog = ({
  category,
  isPending,
  onOpenChange,
  onSubmit,
  open,
}: CategoryFormDialogProps) => {
  const isEdit = category != null;
  const form = useForm<JobCategoryForm>({
    mode: 'onBlur',
    resolver: zodResolver(jobCategoryFormSchema),
    values: category
      ? toJobCategoryFormValues(category)
      : emptyJobCategoryForm(),
  });

  useEffect(() => {
    if (open) {
      form.reset(
        category ? toJobCategoryFormValues(category) : emptyJobCategoryForm(),
      );
    }
  }, [category, form, open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: JobCategoryForm) => {
    onSubmit(values);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_CATEGORY_TITLE : CREATE_CATEGORY_TITLE}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Name, colors, and active status for a job type category.
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
              <FormTextInput<JobCategoryForm>
                label="Name"
                name="name"
                placeholder={CATEGORY_NAME_PLACEHOLDER}
                required
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormColorInput<JobCategoryForm>
                  fallback="#D9D9D9"
                  label="Background Color"
                  name="backgroundColor"
                />
                <FormColorInput<JobCategoryForm>
                  fallback="#374151"
                  label="Text Color"
                  name="textColor"
                />
              </div>
              <FormSwitchField<JobCategoryForm> name="isActive" />
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
