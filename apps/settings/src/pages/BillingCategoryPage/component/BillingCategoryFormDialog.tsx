import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  billingCategoryFormSchema,
  emptyBillingCategoryForm,
  toBillingCategoryFormValues,
  type BillingCategoryForm,
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
  BILLING_CATEGORY_DESCRIPTION_PLACEHOLDER,
  BILLING_CATEGORY_NAME_PLACEHOLDER,
  CREATE_BILLING_CATEGORY_TITLE,
  EDIT_BILLING_CATEGORY_TITLE,
  SAVE_CHANGES_LABEL,
} from '../constant';
import type { BillingCategoryFormDialogProps } from '../types';
import { BillingCategoryDiscardDialog } from './BillingCategoryDiscardDialog';
import { FormSelectField, FormToggleField } from './form';

const EMPTY_FORM = emptyBillingCategoryForm();

export const BillingCategoryFormDialog = ({
  billingCategory,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  typeOptions,
}: BillingCategoryFormDialogProps) => {
  const isEdit = billingCategory != null;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<BillingCategoryForm>({
    mode: 'onBlur',
    resolver: zodResolver(billingCategoryFormSchema),
    defaultValues: EMPTY_FORM,
  });

  const selectOptions: readonly SelectOption[] = (typeOptions ?? [])
    .filter((option) => Boolean(option.billingCategoryType))
    .map((option) => ({
      value: option.billingCategoryType as string,
      label: option.billingCategoryName ?? option.billingCategoryType ?? '',
    }));

  useEffect(() => {
    if (open) {
      form.reset(
        billingCategory
          ? toBillingCategoryFormValues(billingCategory)
          : EMPTY_FORM,
      );
      setDiscardOpen(false);
    }
  }, [billingCategory, form, open]);

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
      billingCategory
        ? toBillingCategoryFormValues(billingCategory)
        : EMPTY_FORM,
    );
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: BillingCategoryForm) => {
    onSubmit(values);
  };

  const submitLabel = isEdit ? SAVE_CHANGES_LABEL : 'Save';

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-6 p-5 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-title font-bold">
              {isEdit
                ? EDIT_BILLING_CATEGORY_TITLE
                : CREATE_BILLING_CATEGORY_TITLE}
            </DialogTitle>
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
                  <FormSelectField<BillingCategoryForm>
                    label="Billing Category Type"
                    name="billingCategoryType"
                    options={selectOptions}
                    placeholder="Select type"
                    required
                  />
                  <FormTextInput<BillingCategoryForm>
                    label="Billing Category Name"
                    name="billingCategoryName"
                    placeholder={BILLING_CATEGORY_NAME_PLACEHOLDER}
                    required
                  />
                </div>
                <FormTextarea<BillingCategoryForm>
                  label="Description"
                  name="description"
                  placeholder={BILLING_CATEGORY_DESCRIPTION_PLACEHOLDER}
                  rows={3}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormToggleField<BillingCategoryForm>
                    label="Show To Field Tech"
                    name="showToFieldTech"
                  />
                  <FormToggleField<BillingCategoryForm>
                    label="Allow To Pick"
                    name="allowToPick"
                  />
                </div>
                <div className="mt-8 flex justify-end gap-2">
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
      <BillingCategoryDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
