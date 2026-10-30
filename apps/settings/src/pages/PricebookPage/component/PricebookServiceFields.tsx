import type { JobTypeSummaryDto } from '@cms/settings-contract';
import type { PriceBookForm } from '@cms/settings-data-access';
import { SectionCard, SectionTitle } from '@cms/ui';
import { FormTextarea, FormTextInput } from '../../../shared/component/form';
import type { PricebookServiceFieldsProps } from '../types';
import { FormSelectField, FormToggleField } from './form';

const toJobTypeOptions = (jobTypes: readonly JobTypeSummaryDto[]) =>
  [...jobTypes]
    .sort((left, right) =>
      (left.name ?? '').localeCompare(right.name ?? '', undefined, {
        sensitivity: 'base',
      }),
    )
    .map((jobType) => ({
      value: String(jobType.id),
      label:
        jobType.name?.trim() ||
        jobType.jobTypeCode?.trim() ||
        `Job type ${jobType.id}`,
    }));

export const PricebookServiceFields = ({
  jobTypes,
}: PricebookServiceFieldsProps) => (
  <SectionCard
    className="flex flex-col gap-4"
    padding="comfortable"
    radius="panel"
    tone="soft"
  >
    <SectionTitle size="sm">Details</SectionTitle>
    <div className="grid gap-4 sm:grid-cols-3">
      <FormTextInput<PriceBookForm>
        label="Code"
        name="priceBookCode"
        placeholder="Enter code"
        required
      />
      <FormTextInput<PriceBookForm>
        label="Name"
        name="priceBookName"
        placeholder="Enter name"
        required
      />
      <FormSelectField<PriceBookForm>
        label="Job Type"
        name="jobTypeId"
        options={toJobTypeOptions(jobTypes)}
        placeholder="Select job type"
        required
      />
    </div>
    <FormTextarea<PriceBookForm>
      label="Item Description"
      name="description"
      placeholder="Write description"
      rows={3}
    />
    <div className="grid gap-4 sm:grid-cols-2">
      <FormToggleField<PriceBookForm>
        description="Tax applies to this service."
        label="Service Taxable"
        name="isTaxable"
      />
      <FormTextInput<PriceBookForm>
        inputMode="decimal"
        label="Estimated Hours"
        name="estimatedHours"
        placeholder="1.00"
        required
      />
    </div>
  </SectionCard>
);
