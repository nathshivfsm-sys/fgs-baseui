import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyTimeslotForm,
  timeslotFormSchema,
  toTimeslotFormValues,
  type TimeslotForm,
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
import { FormTextInput } from '../../../shared/component/form';
import {
  ADD_TIMESLOT_LABEL,
  CODE_PLACEHOLDER,
  CREATE_TIMESLOT_DESCRIPTION,
  CREATE_TIMESLOT_TITLE,
  DURATION_NONE_LABEL,
  DURATION_OPTIONS,
  EDIT_TIMESLOT_DESCRIPTION,
  EDIT_TIMESLOT_TITLE,
  NAME_PLACEHOLDER,
  SAVE_CHANGES_LABEL,
  ZONE_PLACEHOLDER,
} from '../constant';
import type { TimeslotFormDialogProps } from '../types';
import { FormSelectField, FormToggleField } from './form';
import { TimeslotDiscardDialog } from './TimeslotDiscardDialog';

const EMPTY_FORM = emptyTimeslotForm();
const durationOptions = [
  { value: '', label: DURATION_NONE_LABEL },
  ...DURATION_OPTIONS,
];

export const TimeslotFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  timeslot,
  zoneOptions,
}: TimeslotFormDialogProps) => {
  const isEdit = timeslot != null;
  const [discardOpen, setDiscardOpen] = useState(false);
  const form = useForm<TimeslotForm>({
    mode: 'onBlur',
    resolver: zodResolver(timeslotFormSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (open) {
      form.reset(timeslot ? toTimeslotFormValues(timeslot) : EMPTY_FORM);
      setDiscardOpen(false);
    }
  }, [form, open, timeslot]);

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
    form.reset(timeslot ? toTimeslotFormValues(timeslot) : EMPTY_FORM);
    closeForm();
  };

  const handleDiscardOpenChange = (next: boolean) => {
    setDiscardOpen(next);
  };

  const handleSubmit = (values: TimeslotForm) => {
    onSubmit(values);
  };

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="gap-4 p-5 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-title font-bold">
              {isEdit ? EDIT_TIMESLOT_TITLE : CREATE_TIMESLOT_TITLE}
            </DialogTitle>
            <DialogDescription className="text-control text-foreground-subtle">
              {isEdit ? EDIT_TIMESLOT_DESCRIPTION : CREATE_TIMESLOT_DESCRIPTION}
            </DialogDescription>
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
                  <FormTextInput<TimeslotForm>
                    label="Code"
                    name="code"
                    placeholder={CODE_PLACEHOLDER}
                    required
                  />
                  <FormTextInput<TimeslotForm>
                    label="Name"
                    name="name"
                    placeholder={NAME_PLACEHOLDER}
                    required
                  />
                </div>
                <FormSelectField<TimeslotForm>
                  label="Zone"
                  name="zoneId"
                  options={zoneOptions}
                  placeholder={ZONE_PLACEHOLDER}
                  required
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormTextInput<TimeslotForm>
                    label="Begin Time"
                    name="beginTime"
                    required
                    type="time"
                  />
                  <FormTextInput<TimeslotForm>
                    label="End Time"
                    name="endTime"
                    required
                    type="time"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormSelectField<TimeslotForm>
                    label="Late After"
                    name="lateAfter"
                    options={durationOptions}
                  />
                  <FormSelectField<TimeslotForm>
                    label="Delayed After"
                    name="delayedAfter"
                    options={durationOptions}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormToggleField<TimeslotForm>
                    label="Mobile Visible"
                    name="isMobileVisible"
                  />
                  <FormToggleField<TimeslotForm>
                    label="Customer Portal"
                    name="isCustomerPortalVisible"
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
                  {isEdit ? SAVE_CHANGES_LABEL : ADD_TIMESLOT_LABEL}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <TimeslotDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </>
  );
};
