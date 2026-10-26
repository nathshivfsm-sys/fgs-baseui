import type { CustomerCreateForm } from '@cms/customer-data-access';
import type { FieldPathByValue } from 'react-hook-form';
import { SectionSubheading } from '@cms/ui';
import { FormEmailInput, FormPhoneInput, FormTextInput } from './form';

export interface PrimaryContactFieldsProps {
  disabled?: boolean;
  namePrefix: 'customer' | 'serviceLocation';
}

const contactField = (
  prefix: PrimaryContactFieldsProps['namePrefix'],
  field: 'primaryContactName' | 'primaryContactEmail' | 'primaryContactPhone',
): FieldPathByValue<CustomerCreateForm, string> =>
  prefix === 'customer'
    ? field
    : (`serviceLocation.${field}` as FieldPathByValue<
        CustomerCreateForm,
        string
      >);

export const PrimaryContactFields = ({
  disabled,
  namePrefix,
}: PrimaryContactFieldsProps) => (
  <div className="flex flex-col gap-3">
    <SectionSubheading>Primary contact</SectionSubheading>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FormTextInput<CustomerCreateForm>
        disabled={disabled}
        label="Primary contact name"
        name={contactField(namePrefix, 'primaryContactName')}
      />
      <FormEmailInput<CustomerCreateForm>
        disabled={disabled}
        label="Primary contact email"
        name={contactField(namePrefix, 'primaryContactEmail')}
      />
      <FormPhoneInput<CustomerCreateForm>
        disabled={disabled}
        label="Primary contact phone"
        name={contactField(namePrefix, 'primaryContactPhone')}
      />
    </div>
  </div>
);
