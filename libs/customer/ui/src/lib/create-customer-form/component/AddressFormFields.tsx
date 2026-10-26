import type { QueryClient } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import {
  customerAddressFormSchema,
  type CustomerAddressForm,
} from '@cms/customer-data-access';
import { useGeoLookupOptions } from '@cms/shared-data-access';
import { FormSelectField, FormTextInput } from './form';

export interface AddressFormFieldsProps {
  queryClient: QueryClient;
}

export const AddressFormFields = ({ queryClient }: AddressFormFieldsProps) => {
  const form = useFormContext<CustomerAddressForm>();
  const country = form.watch('country');
  const state = form.watch('state');
  const { cityOptions, countryOptions, stateOptions } = useGeoLookupOptions(
    queryClient,
    {
      countryCode: country,
      includeCities: true,
      stateProvinceCode: state,
    },
  );

  const handleCountryChange = () => {
    form.setValue('state', '', { shouldDirty: true, shouldValidate: true });
    form.setValue('city', '', { shouldDirty: true, shouldValidate: true });
  };

  const handleStateChange = () => {
    form.setValue('city', '', { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormTextInput<CustomerAddressForm>
          label="Address line 1"
          name="addressLine1"
          required
        />
      </div>
      <div className="sm:col-span-2">
        <FormTextInput<CustomerAddressForm>
          label="Address line 2"
          name="addressLine2"
        />
      </div>
      <FormSelectField<CustomerAddressForm>
        label="Country"
        name="country"
        onValueChange={handleCountryChange}
        options={countryOptions}
        placeholder="Select country"
        required
      />
      <FormTextInput<CustomerAddressForm>
        label="Postal code"
        name="postalCode"
        required
      />
      <FormSelectField<CustomerAddressForm>
        label="State / province"
        name="state"
        onValueChange={handleStateChange}
        options={stateOptions}
        placeholder="Select state"
        required
      />
      <FormSelectField<CustomerAddressForm>
        label="City"
        name="city"
        options={cityOptions}
        placeholder="Select city"
        required
      />
    </div>
  );
};
