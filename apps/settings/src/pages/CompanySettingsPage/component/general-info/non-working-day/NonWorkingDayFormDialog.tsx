import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type FormEvent } from 'react';
import {
  emptyNonWorkingDateForm,
  toNonWorkingDateFormValues,
  toNonWorkingDateWriteDto,
  nonWorkingDateFormSchema,
  type NonWorkingDateForm,
} from '@cms/settings-data-access';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import {
  CREATE_DESCRIPTION,
  CREATE_TITLE,
  EDIT_DESCRIPTION,
  EDIT_TITLE,
  SAVE_LABEL,
} from '../../../constant';
import type { NonWorkingDayFormDialogProps } from '../../../types';
import { DialogFooterActions } from './DialogFooterActions';
import { NonWorkingDayFormFields } from './NonWorkingDayFormFields';

export const NonWorkingDayFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  row,
}: NonWorkingDayFormDialogProps) => {
  const isEdit = row != null;
  const form = useForm<NonWorkingDateForm>({
    mode: 'onBlur',
    resolver: zodResolver(nonWorkingDateFormSchema),
    values: row ? toNonWorkingDateFormValues(row) : emptyNonWorkingDateForm(),
  });

  useEffect(() => {
    if (open) {
      form.reset(
        row ? toNonWorkingDateFormValues(row) : emptyNonWorkingDateForm(),
      );
    }
  }, [form, open, row]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: NonWorkingDateForm) => {
    onSubmit(toNonWorkingDateWriteDto(values));
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    void form.handleSubmit(handleSubmit)(event);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_TITLE : CREATE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {isEdit ? EDIT_DESCRIPTION : CREATE_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-6"
            noValidate
            onSubmit={handleFormSubmit}
          >
            <NonWorkingDayFormFields />
            <DialogFooterActions
              cancelDisabled={isPending}
              onCancel={handleClose}
              primaryLabel={SAVE_LABEL}
              primaryLoading={isPending}
              primaryType="submit"
            />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
