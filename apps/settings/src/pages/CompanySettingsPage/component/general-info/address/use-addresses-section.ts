import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  toCompanyAddressValue,
  type CompanyAddressForm,
  type CompanySettingsFormValues,
} from '@cms/settings-data-access';
import type { CompanyAddressKind } from '../../../types';

export const useAddressesSection = () => {
  const form = useFormContext<CompanySettingsFormValues>();
  const [kind, setKind] = useState<CompanyAddressKind | null>(null);

  const closeDialog = () => {
    setKind(null);
  };

  const openPhysical = () => {
    setKind('physical');
  };

  const openBilling = () => {
    setKind('billing');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) closeDialog();
  };

  const handleSubmit = (values: CompanyAddressForm) => {
    if (!kind) return;
    const field =
      kind === 'physical' ? 'physicalAddress' : 'billingAddress';
    form.setValue(field, toCompanyAddressValue(values), {
      shouldDirty: true,
      shouldTouch: true,
    });
    closeDialog();
  };

  return {
    billingAddress: form.watch('billingAddress'),
    editingKind: kind,
    handleOpenChange,
    handleSubmit,
    openBilling,
    openPhysical,
    physicalAddress: form.watch('physicalAddress'),
  };
};
