import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { CustomerCreateForm } from '@cms/customer-data-access';

export const useSameAsServiceLocation = (
  form: UseFormReturn<CustomerCreateForm>,
) => {
  const creationOption = form.watch('creationOption');
  const sameAs = form.watch('sameAsServiceLocation');
  const serviceLocation = form.watch('serviceLocation');

  useEffect(() => {
    if (creationOption === 'billToOnly') {
      form.setValue('sameAsServiceLocation', false, { shouldDirty: false });
    }
  }, [creationOption, form]);

  useEffect(() => {
    if (creationOption !== 'billToAndServiceLocation' || !sameAs) {
      return;
    }
    form.setValue('name', serviceLocation.name, { shouldDirty: true });
    form.setValue('displayName', serviceLocation.displayName, {
      shouldDirty: true,
    });
    form.setValue('address', serviceLocation.address, { shouldDirty: true });
    form.setValue('primaryContactName', serviceLocation.primaryContactName, {
      shouldDirty: true,
    });
    form.setValue('primaryContactEmail', serviceLocation.primaryContactEmail, {
      shouldDirty: true,
    });
    form.setValue('primaryContactPhone', serviceLocation.primaryContactPhone, {
      shouldDirty: true,
    });
    form.setValue('taxExempt', serviceLocation.taxExempt, {
      shouldDirty: true,
    });
    form.setValue('tagIds', [...serviceLocation.tagIds], { shouldDirty: true });
  }, [
    creationOption,
    form,
    sameAs,
    serviceLocation.address,
    serviceLocation.displayName,
    serviceLocation.name,
    serviceLocation.primaryContactEmail,
    serviceLocation.primaryContactName,
    serviceLocation.primaryContactPhone,
    serviceLocation.taxExempt,
    serviceLocation.tagIds,
  ]);
};
