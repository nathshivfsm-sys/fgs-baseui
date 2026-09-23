import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RoleLookupDto, UserSummaryDto } from '@cms/user-contract';
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
  EDIT_USER_DESCRIPTION,
  EDIT_USER_TITLE,
} from '../constant';
import {
  editUserFormSchema,
  emptyEditUserForm,
  toEditUserForm,
  type EditUserForm,
} from '../util';
import { FormSelectField } from './form';

export interface EditUserDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EditUserForm) => void;
  open: boolean;
  roles: readonly RoleLookupDto[] | undefined;
  user: UserSummaryDto | null;
}

export const EditUserDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  roles,
  user,
}: EditUserDialogProps) => {
  const form = useForm<EditUserForm>({
    mode: 'onBlur',
    resolver: zodResolver(editUserFormSchema),
    defaultValues: emptyEditUserForm(),
  });

  const roleOptions: readonly SelectOption[] = (roles ?? []).map((role) => ({
    label: role.name ?? role.roleCode ?? String(role.id),
    value: String(role.id),
  }));

  useEffect(() => {
    if (open && user) {
      form.reset(toEditUserForm(user));
    }
  }, [form, open, user]);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: EditUserForm) => {
    onSubmit(values);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {EDIT_USER_TITLE}
          </DialogTitle>
          <DialogDescription>{EDIT_USER_DESCRIPTION}</DialogDescription>
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
                  <FormTextInput<EditUserForm>
                    label="User Name"
                    name="displayName"
                    placeholder="Enter user name"
                    required
                  />
                  <p className="text-[11px] leading-[16.5px] text-foreground-subtle">
                    This will be the display name for the user
                  </p>
                </div>
                <FormSelectField<EditUserForm>
                  label="Role"
                  name="roleId"
                  options={roleOptions}
                  placeholder="Select role"
                  required
                />
                <div className="flex flex-col gap-1">
                  <FormTextInput<EditUserForm>
                    disabled
                    label="Email"
                    name="email"
                    placeholder="Enter email"
                    required
                    type="email"
                  />
                  <p className="text-[11px] leading-[16.5px] text-foreground-subtle">
                    Email cannot be changed after the user is created
                  </p>
                </div>
                <FormTextInput<EditUserForm>
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
