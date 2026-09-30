import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyJobTypeForm,
  JOB_TYPE_USED_FOR_OPTIONS,
  jobTypeFormSchema,
  toJobTypeFormValues,
  type JobTypeForm,
} from '@cms/settings-data-access';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SectionCard,
  type SelectOption,
} from '@cms/ui';
import {
  CREATE_JOB_TYPE_DESCRIPTION,
  CREATE_JOB_TYPE_TITLE,
  EDIT_JOB_TYPE_DESCRIPTION,
  EDIT_JOB_TYPE_TITLE,
  JOB_TYPE_BUSINESS_UNIT_PLACEHOLDER,
  JOB_TYPE_CATEGORY_PLACEHOLDER,
  JOB_TYPE_NAME_PLACEHOLDER,
  JOB_TYPE_SUBCATEGORY_PLACEHOLDER,
  JOB_TYPE_USED_FOR_PLACEHOLDER,
} from '../constant';
import type { JobTypeFormDialogProps } from '../types';
import {
  FormCheckboxField,
  FormSelectField,
  FormSwitchField,
  FormTextInput,
} from './form';

export const JobTypeFormDialog = ({
  businessUnitOptions,
  categories,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  record,
  subcategories,
}: JobTypeFormDialogProps) => {
  const isEdit = record != null;
  const form = useForm<JobTypeForm>({
    mode: 'onBlur',
    resolver: zodResolver(jobTypeFormSchema),
    values: record ? toJobTypeFormValues(record) : emptyJobTypeForm(),
  });
  const categoryId = form.watch('categoryId');
  const subcategoryId = form.watch('subcategoryId');

  useEffect(() => {
    if (open) {
      form.reset(record ? toJobTypeFormValues(record) : emptyJobTypeForm());
    }
  }, [form, open, record]);

  const subcategoryOptions = useMemo<SelectOption[]>(() => {
    return subcategories
      .filter(
        (item) =>
          String(item.jobCategoryId) === categoryId &&
          (item.isActive || String(item.id) === subcategoryId),
      )
      .map((item) => ({
        value: String(item.id),
        label: item.name?.trim() || `Subcategory ${item.id}`,
      }));
  }, [categoryId, subcategoryId, subcategories]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: JobTypeForm) => {
    onSubmit(values);
  };

  const handleCategoryChange = () => {
    form.setValue('subcategoryId', '');
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_JOB_TYPE_TITLE : CREATE_JOB_TYPE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {isEdit ? EDIT_JOB_TYPE_DESCRIPTION : CREATE_JOB_TYPE_DESCRIPTION}
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
                <FormTextInput<JobTypeForm>
                  label="Job Type"
                  name="name"
                  placeholder={JOB_TYPE_NAME_PLACEHOLDER}
                  required
                />
                <FormSelectField<JobTypeForm>
                  label="Category"
                  name="categoryId"
                  onValueChange={handleCategoryChange}
                  options={categories}
                  placeholder={JOB_TYPE_CATEGORY_PLACEHOLDER}
                  required
                />
                <FormSelectField<JobTypeForm>
                  disabled={!categoryId}
                  label="Sub-Category"
                  name="subcategoryId"
                  options={subcategoryOptions}
                  placeholder={JOB_TYPE_SUBCATEGORY_PLACEHOLDER}
                  required
                />
                <FormSelectField<JobTypeForm>
                  label="Business Unit"
                  name="businessUnit"
                  options={businessUnitOptions}
                  placeholder={JOB_TYPE_BUSINESS_UNIT_PLACEHOLDER}
                />
                <FormSelectField<JobTypeForm>
                  label="Used For"
                  name="usedFor"
                  options={JOB_TYPE_USED_FOR_OPTIONS}
                  placeholder={JOB_TYPE_USED_FOR_PLACEHOLDER}
                  required
                />
                <div className="hidden sm:block" aria-hidden="true" />
                <div className="flex items-end pb-2">
                  <FormCheckboxField<JobTypeForm>
                    label="Show to Field Tech"
                    name="showToFieldTech"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <FormCheckboxField<JobTypeForm>
                    label="Show on Customer Portal"
                    name="showOnCustomerPortal"
                  />
                </div>
              </div>
              <FormSwitchField<JobTypeForm> name="isActive" />
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
