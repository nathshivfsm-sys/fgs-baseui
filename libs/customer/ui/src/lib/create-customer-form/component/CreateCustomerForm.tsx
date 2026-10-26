import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import {
  customerCreateFormSchema,
  emptyCustomerCreateForm,
  normalizeServiceLocationFormValues,
  type CustomerCreateForm,
} from '@cms/customer-data-access';
import { cn, SectionCard } from '@cms/ui';
import { CREATE_CUSTOMER_FORM_ID } from '../constant';
import type { CreateCustomerFormProps } from '../types';
import { useSameAsServiceLocation } from '../util';
import { ArCustomerSection } from './ArCustomerSection';
import { CreationOptionSelector } from './CreationOptionSelector';
import { ServiceLocationSection } from './ServiceLocationSection';

export const CreateCustomerForm = ({
  onCreationOptionChange,
  onDirtyChange,
  onSubmit,
  queryClient,
}: CreateCustomerFormProps) => {
  const resolver: Resolver<CustomerCreateForm> = async (
    values,
    context,
    options,
  ) =>
    zodResolver(customerCreateFormSchema)(
      {
        ...values,
        serviceLocation: normalizeServiceLocationFormValues(
          values.serviceLocation,
        ),
      },
      context,
      options,
    );

  const form = useForm<CustomerCreateForm>({
    mode: 'onBlur',
    resolver,
    defaultValues: emptyCustomerCreateForm(),
    shouldUnregister: false,
  });

  useSameAsServiceLocation(form);

  const creationOption = form.watch('creationOption');
  const showServiceLocation = creationOption === 'billToAndServiceLocation';

  useEffect(() => {
    onCreationOptionChange(creationOption);
  }, [creationOption, onCreationOptionChange]);

  useEffect(() => {
    onDirtyChange(form.formState.isDirty);
  }, [form.formState.isDirty, onDirtyChange]);

  const handleCreationOptionChange = (
    option: CustomerCreateForm['creationOption'],
  ) => {
    form.setValue('creationOption', option, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleFormSubmit = form.handleSubmit(onSubmit);

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-5"
        id={CREATE_CUSTOMER_FORM_ID}
        noValidate
        onSubmit={handleFormSubmit}
      >
        <CreationOptionSelector
          creationOption={creationOption}
          onCreationOptionChange={handleCreationOptionChange}
        />
        <SectionCard padding="none" radius="panel" tone="soft">
          <div
            className={cn(
              'grid grid-cols-1 divide-border-subtle max-md:divide-y md:grid-cols-2 md:divide-x',
              !showServiceLocation && 'md:grid-cols-1 md:divide-x-0',
            )}
          >
            {showServiceLocation ? (
              <ServiceLocationSection queryClient={queryClient} />
            ) : null}
            <ArCustomerSection
              queryClient={queryClient}
              showSameAsServiceLocation={showServiceLocation}
            />
          </div>
        </SectionCard>
      </form>
    </FormProvider>
  );
};
