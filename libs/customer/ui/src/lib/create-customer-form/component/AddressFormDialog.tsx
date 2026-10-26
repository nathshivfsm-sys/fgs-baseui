import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type FormEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  customerAddressFormSchema,
  type CustomerAddressForm,
} from '@cms/customer-data-access';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import type { QueryClient } from '@tanstack/react-query';
import { AddressFormFields } from './AddressFormFields';

export interface AddressFormDialogProps {
  address: CustomerAddressForm | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (address: CustomerAddressForm) => void;
  open: boolean;
  queryClient: QueryClient;
  title: string;
}

const emptyAddress = (): CustomerAddressForm => ({
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
});

export const AddressFormDialog = ({
  address,
  onOpenChange,
  onSubmit,
  open,
  queryClient,
  title,
}: AddressFormDialogProps) => {
  const form = useForm<CustomerAddressForm>({
    mode: 'onBlur',
    resolver: zodResolver(customerAddressFormSchema),
    values: address ?? emptyAddress(),
  });

  useEffect(() => {
    if (open) {
      form.reset(address ?? emptyAddress());
    }
  }, [address, form, open]);

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
          <DialogTitle className="text-title font-bold">{title}</DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            Enter the street, city, and postal details for this record.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-6"
            noValidate
            onSubmit={handleFormSubmit}
          >
            <AddressFormFields queryClient={queryClient} />
            <div className="flex justify-end gap-3">
              <Button onClick={handleClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save address</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
