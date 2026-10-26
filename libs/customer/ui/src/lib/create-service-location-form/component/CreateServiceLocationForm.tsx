import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import {
  emptyServiceLocationOnlyForm,
  normalizeServiceLocationFormValues,
  serviceLocationOnlyFormSchema,
  type ServiceLocationOnlyForm,
} from '@cms/customer-data-access';
import { CREATE_SERVICE_LOCATION_FORM_ID } from '../constant';
import type { CreateServiceLocationFormProps } from '../types';
import { ServiceLocationSection } from '../../create-customer-form/component/ServiceLocationSection';

export const CreateServiceLocationForm = ({
  onDirtyChange,
  onSubmit,
  queryClient,
}: CreateServiceLocationFormProps) => {
  const resolver: Resolver<ServiceLocationOnlyForm> = async (
    values,
    context,
    options,
  ) =>
    zodResolver(serviceLocationOnlyFormSchema)(
      {
        serviceLocation: normalizeServiceLocationFormValues(
          values.serviceLocation,
        ),
      },
      context,
      options,
    );

  const form = useForm<ServiceLocationOnlyForm>({
    mode: 'onBlur',
    resolver,
    defaultValues: emptyServiceLocationOnlyForm(),
    shouldUnregister: false,
  });

  useEffect(() => {
    onDirtyChange(form.formState.isDirty);
  }, [form.formState.isDirty, onDirtyChange]);

  const handleFormSubmit = form.handleSubmit(onSubmit);

  return (
    <FormProvider {...form}>
      <form
        id={CREATE_SERVICE_LOCATION_FORM_ID}
        noValidate
        onSubmit={handleFormSubmit}
      >
        <ServiceLocationSection queryClient={queryClient} />
      </form>
    </FormProvider>
  );
};
