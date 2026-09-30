import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptySubcategoryForm,
  subcategoryFormSchema,
  toSubcategoryFormValues,
  type SubcategoryForm,
} from '@cms/settings-data-access';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SectionCard,
  TextInput,
  type SelectOption,
} from '@cms/ui';
import {
  CREATE_SUBCATEGORY_DESCRIPTION,
  CREATE_SUBCATEGORY_TITLE,
  EDIT_SUBCATEGORY_DESCRIPTION,
  EDIT_SUBCATEGORY_TITLE,
  SUBCATEGORY_NAME_PLACEHOLDER,
  SUBCATEGORY_PRIORITY_PLACEHOLDER,
  SUBCATEGORY_SKILL_PLACEHOLDER,
  SUBCATEGORY_TASK_PLACEHOLDER,
  SUBCATEGORY_TIME_PLACEHOLDER,
  SUBCATEGORY_TRADE_PLACEHOLDER,
} from '../constant';
import type { SubcategoryFormDialogProps } from '../types';
import { FormSelectField, FormSwitchField, FormTextInput } from './form';

const PRIORITY_OPTIONS: readonly SelectOption[] = [
  { value: '1', label: 'High' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'Low' },
];

export const SubcategoryFormDialog = ({
  categoryName,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  record,
  skillOptions,
  tradeOptions,
}: SubcategoryFormDialogProps) => {
  const isEdit = record != null;
  const form = useForm<SubcategoryForm>({
    mode: 'onBlur',
    resolver: zodResolver(subcategoryFormSchema),
    values: record ? toSubcategoryFormValues(record) : emptySubcategoryForm(),
  });

  useEffect(() => {
    if (open) {
      form.reset(
        record ? toSubcategoryFormValues(record) : emptySubcategoryForm(),
      );
    }
  }, [form, open, record]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: SubcategoryForm) => {
    onSubmit(values);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_SUBCATEGORY_TITLE : CREATE_SUBCATEGORY_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {isEdit
              ? EDIT_SUBCATEGORY_DESCRIPTION
              : CREATE_SUBCATEGORY_DESCRIPTION}
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
                <TextInput
                  disabled
                  label="Category"
                  readOnly
                  required
                  value={categoryName}
                  variant="soft"
                />
                <FormTextInput<SubcategoryForm>
                  label="Name"
                  name="name"
                  placeholder={SUBCATEGORY_NAME_PLACEHOLDER}
                  required
                />
                <FormSelectField<SubcategoryForm>
                  label="Trade"
                  name="tradeId"
                  options={tradeOptions}
                  placeholder={SUBCATEGORY_TRADE_PLACEHOLDER}
                  required
                />
                <FormSelectField<SubcategoryForm>
                  label="Skill"
                  name="skillLevelId"
                  options={skillOptions}
                  placeholder={SUBCATEGORY_SKILL_PLACEHOLDER}
                />
                <FormTextInput<SubcategoryForm>
                  label="Task Name"
                  name="taskName"
                  placeholder={SUBCATEGORY_TASK_PLACEHOLDER}
                />
                <FormTextInput<SubcategoryForm>
                  inputMode="decimal"
                  label="Estimated Time"
                  name="estimatedHours"
                  placeholder={SUBCATEGORY_TIME_PLACEHOLDER}
                  required
                />
                <FormSelectField<SubcategoryForm>
                  label="Priority"
                  name="priority"
                  options={PRIORITY_OPTIONS}
                  placeholder={SUBCATEGORY_PRIORITY_PLACEHOLDER}
                  required
                />
                <div className="flex items-end pb-2">
                  <FormSwitchField<SubcategoryForm> name="isActive" />
                </div>
              </div>
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
