import { useQuery } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  glBreakLookupQueryOptions,
  tagLookupQueryOptions,
} from '@cms/shared-data-access';
import type {
  CustomerCreateForm,
  ServiceLocationOnlyForm,
} from '@cms/customer-data-access';
import {
  SectionHeader,
  SectionSubheading,
  SectionTitle,
  type SelectOption,
} from '@cms/ui';
import { CUSTOMER_TYPE_OPTIONS, isCustomerType } from '../constant';
import {
  FormCheckbox,
  FormSelectField,
  FormStackedCheckbox,
  FormTextInput,
} from './form';
import { CustomerAddressSection } from './CustomerAddressSection';
import { PrimaryContactFields } from './PrimaryContactFields';
import type { ServiceLocationSectionProps } from '../types';
import { TagsField } from './TagsField';

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

const toBusinessUnitOptions = (
  rows: readonly {
    id: number;
    code?: string | null;
    name?: string | null;
    breakLevel: number;
  }[],
): SelectOption[] =>
  rows
    .filter((row) => row.breakLevel === 1)
    .map((row) => ({
      value: String(row.id),
      label: row.name ?? row.code ?? String(row.id),
    }));

type ServiceLocationSectionForm = CustomerCreateForm | ServiceLocationOnlyForm;

export const ServiceLocationSection = ({
  queryClient,
}: ServiceLocationSectionProps) => {
  const form = useFormContext<ServiceLocationSectionForm>();
  const slAddress = form.watch('serviceLocation.address');
  const slCustomerType = form.watch('serviceLocation.customerType');

  useLayoutEffect(() => {
    if (!isCustomerType(slCustomerType)) {
      form.setValue('serviceLocation.customerType', 'residential', {
        shouldValidate: false,
      });
    }
  }, [form, slCustomerType]);

  const tagsQuery = useQuery(tagLookupQueryOptions(true), queryClient);
  const glBreakQuery = useQuery(glBreakLookupQueryOptions(true), queryClient);

  const handleSlAddressChange = (
    address: ServiceLocationSectionForm['serviceLocation']['address'],
  ) => {
    form.setValue('serviceLocation.address', address, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="min-w-0 px-5 pb-5 pt-5">
      <SectionHeader bordered className="shrink-0">
        <SectionTitle size="sm">Service location information</SectionTitle>
      </SectionHeader>
      <div className="flex flex-col gap-5 pt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FormTextInput<ServiceLocationSectionForm>
            label="Location name"
            name="serviceLocation.name"
            required
          />
          <FormTextInput<ServiceLocationSectionForm>
            label="Display name"
            name="serviceLocation.displayName"
            required
          />
          <FormSelectField<ServiceLocationSectionForm>
            label="Customer type"
            name="serviceLocation.customerType"
            options={CUSTOMER_TYPE_OPTIONS}
            placeholder="Select customer type"
            required
          />
        </div>
        <CustomerAddressSection
          address={slAddress}
          onAddressChange={handleSlAddressChange}
          queryClient={queryClient}
          title="Address"
        />
        <PrimaryContactFields namePrefix="serviceLocation" />
        <div className="flex flex-col gap-3">
          <SectionSubheading>Can receive</SectionSubheading>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <FormCheckbox<ServiceLocationSectionForm>
              label="Estimates"
              name="serviceLocation.canReceiveEstimates"
            />
            <FormCheckbox<ServiceLocationSectionForm>
              label="Invoices"
              name="serviceLocation.canReceiveInvoices"
            />
            <FormCheckbox<ServiceLocationSectionForm>
              label="Appointments"
              name="serviceLocation.canReceiveAppointments"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormStackedCheckbox<ServiceLocationSectionForm>
              checkboxLabel="This location is tax exempt"
              label="Tax exempt"
              name="serviceLocation.taxExempt"
            />
            <TagsField
              name="serviceLocation.tagIds"
              options={toTagOptions(tagsQuery.data ?? [])}
            />
          </div>
          <FormSelectField<ServiceLocationSectionForm>
            label="Business unit"
            name="serviceLocation.break1Id"
            options={toBusinessUnitOptions(glBreakQuery.data ?? [])}
            placeholder="Select business unit"
          />
        </div>
      </div>
    </section>
  );
};
