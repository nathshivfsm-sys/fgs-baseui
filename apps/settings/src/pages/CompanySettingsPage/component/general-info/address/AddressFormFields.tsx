import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  toCompanyAddressForm,
  type CompanyAddressForm,
} from '@cms/settings-data-access';
import { Checkbox } from '@cms/ui';
import { COUNTRY_OPTIONS, SAME_AS_PHYSICAL_LABEL } from '../../../constant';
import type { AddressFormFieldsProps } from '../../../types';
import { FormSelectField, FormTextInput } from '../../form';

export const AddressFormFields = ({
  kind,
  physicalAddress,
}: AddressFormFieldsProps) => {
  const sameAsPhysicalLabelId = useId();
  const form = useFormContext<CompanyAddressForm>();
  const sameAsPhysical = form.watch('sameAsPhysical');
  const fieldsLocked = kind === 'billing' && sameAsPhysical;
  const showSameAsPhysical = kind === 'billing';

  const handleSameAsPhysicalChange = (
    checked: boolean | 'indeterminate',
  ) => {
    const isChecked = checked === true;
    form.setValue('sameAsPhysical', isChecked, { shouldDirty: true });
    if (!isChecked) return;
    const snapshot = toCompanyAddressForm(physicalAddress, true);
    form.setValue('addressLine1', snapshot.addressLine1, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('addressLine2', snapshot.addressLine2, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('city', snapshot.city, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('state', snapshot.state, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('postalCode', snapshot.postalCode, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('country', snapshot.country, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {showSameAsPhysical ? (
        <div className="flex items-center gap-2 text-control text-surface-foreground sm:col-span-2">
          <Controller
            control={form.control}
            name="sameAsPhysical"
            render={({ field }) => (
              <Checkbox
                aria-labelledby={sameAsPhysicalLabelId}
                checked={field.value}
                disabled={physicalAddress == null}
                onCheckedChange={handleSameAsPhysicalChange}
                radius="xs"
                size="sm"
                tone="action"
              />
            )}
          />
          <span className="text-control" id={sameAsPhysicalLabelId}>
            {SAME_AS_PHYSICAL_LABEL}
          </span>
        </div>
      ) : null}
      <div className="sm:col-span-2">
        <FormTextInput<CompanyAddressForm>
          label="Address Line 1"
          name="addressLine1"
          placeholder="Enter address line 1"
          readOnly={fieldsLocked}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <FormTextInput<CompanyAddressForm>
          label="Address Line 2"
          name="addressLine2"
          placeholder="Enter address line 2"
          readOnly={fieldsLocked}
        />
      </div>
      <FormTextInput<CompanyAddressForm>
        label="City"
        name="city"
        placeholder="Enter city"
        readOnly={fieldsLocked}
        required
      />
      <FormTextInput<CompanyAddressForm>
        label="State"
        name="state"
        placeholder="Enter state"
        readOnly={fieldsLocked}
        required
      />
      <FormTextInput<CompanyAddressForm>
        label="Postal Code"
        name="postalCode"
        placeholder="Enter postal code"
        readOnly={fieldsLocked}
        required
      />
      <FormSelectField<CompanyAddressForm>
        disabled={fieldsLocked}
        label="Country"
        name="country"
        options={COUNTRY_OPTIONS}
        placeholder="Select country"
        required
      />
    </div>
  );
};
