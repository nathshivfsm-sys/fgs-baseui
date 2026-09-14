import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type FormEvent } from 'react';
import {
  companyAddressFormSchema,
  isSameCompanyAddress,
  toCompanyAddressForm,
  type CompanyAddressForm,
} from '@cms/settings-data-access';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import {
  EDIT_ADDRESS_DESCRIPTION,
  EDIT_BILLING_TITLE,
  EDIT_PHYSICAL_TITLE,
  SAVE_ADDRESS_LABEL,
} from '../../../constant';
import type { AddressFormDialogProps } from '../../../types';
import { AddressFormFields } from './AddressFormFields';

export const AddressFormDialog = ({
  address,
  kind,
  onOpenChange,
  onSubmit,
  open,
  physicalAddress,
}: AddressFormDialogProps) => {
  const sameAsPhysical =
    kind === 'billing' && isSameCompanyAddress(address, physicalAddress);
  const form = useForm<CompanyAddressForm>({
    mode: 'onBlur',
    resolver: zodResolver(companyAddressFormSchema),
    values: toCompanyAddressForm(address, sameAsPhysical),
  });

  useEffect(() => {
    if (open) {
      form.reset(toCompanyAddressForm(address, sameAsPhysical));
    }
  }, [address, form, open, sameAsPhysical]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    void form.handleSubmit(onSubmit)(event);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {kind === 'billing' ? EDIT_BILLING_TITLE : EDIT_PHYSICAL_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {EDIT_ADDRESS_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-6"
            noValidate
            onSubmit={handleFormSubmit}
          >
            <AddressFormFields
              kind={kind}
              physicalAddress={physicalAddress}
            />
            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <Button onClick={handleClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" variant="action">
                {SAVE_ADDRESS_LABEL}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
