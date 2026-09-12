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
import type {
  NonWorkingDateCreateDto,
  NonWorkingDateSummaryDto,
} from '@cms/settings-contract';
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
  CREATE_DESCRIPTION,
  CREATE_TITLE,
  DESCRIPTION_PLACEHOLDER,
  EDIT_DESCRIPTION,
  EDIT_TITLE,
  SAVE_LABEL,
} from '../../constant';
import { FormTextInput } from '../form';

export interface NonWorkingDayFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: NonWorkingDateCreateDto) => void;
  open: boolean;
  row: NonWorkingDateSummaryDto | null;
}

export function NonWorkingDayFormDialog({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  row,
}: NonWorkingDayFormDialogProps) {
  const isEdit = row != null;
  const form = useForm<NonWorkingDateForm>({
    mode: 'onBlur',
    resolver: zodResolver(nonWorkingDateFormSchema),
    values: row ? toNonWorkingDateFormValues(row) : emptyNonWorkingDateForm(),
  });

  useEffect(() => {
    if (open) {
      form.reset(row ? toNonWorkingDateFormValues(row) : emptyNonWorkingDateForm());
    }
  }, [form, open, row]);

  function handleClose() {
    onOpenChange(false);
  }

  function handleSubmit(values: NonWorkingDateForm) {
    onSubmit(toNonWorkingDateWriteDto(values));
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.stopPropagation();
    void form.handleSubmit(handleSubmit)(event);
  }

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
            <SectionCard
              className="flex flex-col gap-3"
              padding="comfortable"
              radius="panel"
              tone="soft"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormTextInput<NonWorkingDateForm>
                  label="Date"
                  name="nonWorkingDate"
                  required
                  type="date"
                />
                <FormTextInput<NonWorkingDateForm>
                  label="Description"
                  name="name"
                  placeholder={DESCRIPTION_PLACEHOLDER}
                  required
                />
              </div>
            </SectionCard>
            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <Button
                disabled={isPending}
                onClick={handleClose}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button loading={isPending} type="submit" variant="action">
                {SAVE_LABEL}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
