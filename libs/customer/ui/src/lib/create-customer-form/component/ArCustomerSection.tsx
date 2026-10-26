import { useId } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
import type { CustomerCreateForm } from '@cms/customer-data-access';
import {
  paymentTermLookupQueryOptions,
  tagLookupQueryOptions,
} from '@cms/shared-data-access';
import {
  Checkbox,
  SectionHeader,
  SectionTitle,
  type SelectOption,
} from '@cms/ui';
import { FormSelectField, FormStackedCheckbox, FormTextInput } from './form';
import { CustomerAddressSection } from './CustomerAddressSection';
import { PrimaryContactFields } from './PrimaryContactFields';
import type { ArCustomerSectionProps } from '../types';
import { TagsField } from './TagsField';

const toPaymentTermOptions = (
  rows: readonly { id: number; name?: string | null }[],
): SelectOption[] =>
  rows.map((row) => ({
    value: String(row.id),
    label: row.name ?? String(row.id),
  }));

const toTagOptions = (
  rows: readonly {
    id: number;
    tagCode?: string | null;
    name?: string | null;
  }[],
): SelectOption[] =>
  rows.map((row) => ({
    value: String(row.id),
    label: row.name ?? row.tagCode ?? String(row.id),
  }));

export const ArCustomerSection = ({
  queryClient,
  showSameAsServiceLocation,
}: ArCustomerSectionProps) => {
  const sameAsLabelId = useId();
  const form = useFormContext<CustomerCreateForm>();
  const sameAs = form.watch('sameAsServiceLocation');
  const arAddress = form.watch('address');
  const arFieldsLocked = showSameAsServiceLocation && sameAs;

  const paymentTermsQuery = useQuery(
    paymentTermLookupQueryOptions(true),
    queryClient,
  );
  const tagsQuery = useQuery(tagLookupQueryOptions(true), queryClient);

  const handleArAddressChange = (address: CustomerCreateForm['address']) => {
    form.setValue('address', address, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSameAsChange = (checked: boolean | 'indeterminate') => {
    form.setValue('sameAsServiceLocation', checked === true, {
      shouldDirty: true,
    });
  };

  return (
    <section className="min-w-0 px-5 pb-5 pt-5">
      <SectionHeader bordered className="shrink-0 justify-between gap-3">
        <SectionTitle size="sm">AR customer information</SectionTitle>
        {showSameAsServiceLocation ? (
          <div className="flex items-center gap-2">
            <Controller
              control={form.control}
              name="sameAsServiceLocation"
              render={({ field }) => (
                <Checkbox
                  aria-labelledby={sameAsLabelId}
                  checked={field.value}
                  onCheckedChange={handleSameAsChange}
                  radius="xs"
                  size="sm"
                  tone="action"
                />
              )}
            />
            <span
              className="text-caption font-medium uppercase tracking-section"
              id={sameAsLabelId}
            >
              Same as service location
            </span>
          </div>
        ) : null}
      </SectionHeader>
      <div className="flex flex-col gap-5 pt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormTextInput<CustomerCreateForm>
            disabled={arFieldsLocked}
            label="Customer name"
            name="name"
            required={!arFieldsLocked}
          />
          <FormTextInput<CustomerCreateForm>
            disabled={arFieldsLocked}
            label="Display name"
            name="displayName"
            required={!arFieldsLocked}
          />
        </div>
        <CustomerAddressSection
          address={arAddress}
          disabled={arFieldsLocked}
          onAddressChange={handleArAddressChange}
          queryClient={queryClient}
          title="Address"
        />
        <PrimaryContactFields disabled={arFieldsLocked} namePrefix="customer" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormTextInput<CustomerCreateForm> label="Website" name="website" />
          <FormSelectField<CustomerCreateForm>
            label="Payment terms"
            name="defaultPaymentTermId"
            options={toPaymentTermOptions(paymentTermsQuery.data ?? [])}
            placeholder="Select payment terms"
            required
          />
          <FormStackedCheckbox<CustomerCreateForm>
            checkboxLabel="This customer is tax exempt"
            disabled={arFieldsLocked}
            label="Tax exempt"
            name="taxExempt"
          />
        </div>
        <TagsField
          disabled={arFieldsLocked}
          name="tagIds"
          options={toTagOptions(tagsQuery.data ?? [])}
        />
      </div>
    </section>
  );
};
