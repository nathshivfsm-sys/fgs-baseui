import type { QueryClient } from '@tanstack/react-query';
import type {
  CustomerAddressForm,
  CustomerCreateForm,
} from '@cms/customer-data-access';
import type { FieldPathByValue, FieldValues } from 'react-hook-form';
import type {
  EmailInputFieldProps,
  PhoneInputProps,
  TextInputProps,
} from '@cms/ui';

export interface CreateCustomerFormProps {
  onCreationOptionChange: (
    option: CustomerCreateForm['creationOption'],
  ) => void;
  onDirtyChange: (dirty: boolean) => void;
  onSubmit: (values: CustomerCreateForm) => void;
  queryClient: QueryClient;
}

export interface FormTextInputProps<Values extends FieldValues>
  extends Omit<TextInputProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}

export interface FormEmailInputProps<Values extends FieldValues>
  extends Omit<
    EmailInputFieldProps,
    'defaultValue' | 'error' | 'name' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
}

export interface FormPhoneInputProps<Values extends FieldValues>
  extends Omit<
    PhoneInputProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
}

export interface AddressSectionProps {
  address: CustomerAddressForm | null;
  disabled?: boolean;
  onAddressChange: (address: CustomerAddressForm | null) => void;
  queryClient: QueryClient;
  title: string;
}

export interface CreationOptionSelectorProps {
  creationOption: CustomerCreateForm['creationOption'];
  onCreationOptionChange: (
    option: CustomerCreateForm['creationOption'],
  ) => void;
}

export interface ServiceLocationSectionProps {
  queryClient: QueryClient;
}

export interface ArCustomerSectionProps {
  queryClient: QueryClient;
  showSameAsServiceLocation: boolean;
}
