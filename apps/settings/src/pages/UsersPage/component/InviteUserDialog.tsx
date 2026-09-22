import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RoleLookupDto } from '@cms/user-contract';
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
import { FormTextInput } from '../../../shared/component/form';
import {
  INVITE_USER_DESCRIPTION,
  INVITE_USER_TITLE,
} from '../constant';
import {
  emptyInviteUserForm,
  inviteUserFormSchema,
  type InviteUserForm,
} from '../util';
import { FormSelectField } from './form';

export interface InviteUserDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: InviteUserForm) => void;
  open: boolean;
  roles: readonly RoleLookupDto[] | undefined;
}

export const InviteUserDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  roles,
}: InviteUserDialogProps) => {
  const form = useForm<InviteUserForm>({
    mode: 'onBlur',
    resolver: zodResolver(inviteUserFormSchema),
    defaultValues: emptyInviteUserForm(),
  });

  const roleOptions: readonly SelectOption[] = (roles ?? []).map((role) => ({
    label: role.name ?? role.roleCode ?? String(role.id),
    value: String(role.id),
  }));

  useEffect(() => {
    if (open) {
      form.reset(emptyInviteUserForm());
    }
  }, [form, open]);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: InviteUserForm) => {
    onSubmit(values);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {INVITE_USER_TITLE}
          </DialogTitle>
          <DialogDescription>{INVITE_USER_DESCRIPTION}</DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <SectionCard
              className="flex flex-col gap-3"
              padding="comfortable"
              radius="panel"
              tone="soft"
            >
              <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <FormTextInput<InviteUserForm>
                    label="User Name"
                    name="displayName"
                    placeholder="Enter user name"
                    required
                  />
                  <p className="text-[11px] leading-[16.5px] text-foreground-subtle">
                    This will be the display name for the user
                  </p>
                </div>
                <FormSelectField<InviteUserForm>
                  label="Role"
                  name="roleId"
                  options={roleOptions}
                  placeholder="Select role"
                  required
                />
                <div className="flex flex-col gap-1">
                  <FormTextInput<InviteUserForm>
                    label="Email"
                    name="email"
                    placeholder="Enter email"
                    required
                    type="email"
                  />
                  <p className="text-[11px] leading-[16.5px] text-foreground-subtle">
                    A verification email will be sent to this address
                  </p>
                </div>
                <FormTextInput<InviteUserForm>
                  label="Phone"
                  name="phoneNumber"
                  placeholder="Enter phone"
                  required
                />
              </div>

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
