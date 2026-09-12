import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  emptyZoneForm,
  toZoneFormValues,
  toZoneWriteDto,
  zoneFormSchema,
  type ZoneForm,
} from '@cms/settings-data-access';
import type { ZoneCreateDto, ZoneSummaryDto } from '@cms/settings-contract';
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
  CREATE_ZONE_DESCRIPTION,
  CREATE_ZONE_TITLE,
  EDIT_ZONE_DESCRIPTION,
  EDIT_ZONE_TITLE,
  ZONE_CODE_PLACEHOLDER,
  ZONE_DESCRIPTION_PLACEHOLDER,
  ZONE_NAME_PLACEHOLDER,
} from '../constant';
import { FormTextarea, FormTextInput } from './form';

export interface ZoneFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: ZoneCreateDto) => void;
  open: boolean;
  zone: ZoneSummaryDto | null;
}

export function ZoneFormDialog({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  zone,
}: ZoneFormDialogProps) {
  const isEdit = zone != null;
  const form = useForm<ZoneForm>({
    mode: 'onBlur',
    resolver: zodResolver(zoneFormSchema),
    values: zone ? toZoneFormValues(zone) : emptyZoneForm(),
  });

  useEffect(() => {
    if (open) {
      form.reset(zone ? toZoneFormValues(zone) : emptyZoneForm());
    }
  }, [form, open, zone]);

  function handleClose() {
    onOpenChange(false);
  }

  function handleSubmit(values: ZoneForm) {
    onSubmit(toZoneWriteDto(values));
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_ZONE_TITLE : CREATE_ZONE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {isEdit ? EDIT_ZONE_DESCRIPTION : CREATE_ZONE_DESCRIPTION}
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
                <FormTextInput<ZoneForm>
                  label="Code"
                  name="code"
                  placeholder={ZONE_CODE_PLACEHOLDER}
                  required
                />
                <FormTextInput<ZoneForm>
                  label="Zone Name"
                  name="name"
                  placeholder={ZONE_NAME_PLACEHOLDER}
                  required
                />
              </div>
              <FormTextarea<ZoneForm>
                label="Description"
                name="description"
                placeholder={ZONE_DESCRIPTION_PLACEHOLDER}
                rows={3}
              />
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
}
