import { useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  formatExampleWorkOrderNumber,
  workOrderBookingFormSchema,
  type WorkOrderBookingFormValues,
} from '@cms/settings-data-access';
import { BodySmall, Callout, SectionCard, SectionTitle } from '@cms/ui';
import { FormTextInput } from '../../../shared/component/form';
import { FormSelectField } from './form';
import {
  CUSTOM_FIELD_1_LABEL,
  CUSTOM_FIELD_2_LABEL,
  CUSTOM_FIELD_3_LABEL,
  CUSTOM_FIELD_4_LABEL,
  EXAMPLE_WORK_NUMBER_LABEL,
  INSTALLATION_LABEL,
  MAINTENANCE_LABEL,
  MAINTENANCE_POPUP_DESCRIPTION,
  MAINTENANCE_POPUP_LABEL,
  READ_ONLY_HINT,
  SECTION_CALL_BOOKING,
  SECTION_CUSTOM_FIELDS,
  SECTION_CUSTOM_FIELDS_DESCRIPTION,
  SECTION_EARLIEST_AVAILABILITY,
  SECTION_EARLIEST_AVAILABILITY_DESCRIPTION,
  SECTION_WORK_ORDER_NUMBER,
  SEQUENCE_LOCKED_HINT,
  SEQUENCE_NUMBER_LABEL,
  SERVICE_LABEL,
  SOURCE_REQUIRED_DESCRIPTION,
  SOURCE_REQUIRED_LABEL,
  WARRANTY_LABEL,
} from '../constant';
import { yearModeOptions } from '../constant/options';
import type { WorkOrderBookingConfigurationFormProps } from '../types';
import {
  FormAvailabilityField,
  FormOptionalLabel,
  FormSettingSwitchField,
} from './form';

const findBusinessUnitCode = (
  options: readonly { value: string; label: string }[],
  id: string,
) => {
  if (!id) return '';
  const match = options.find((option) => option.value === id);
  if (!match) return '';
  const [code] = match.label.split(' — ');
  return code?.trim() ?? '';
};

export const WorkOrderBookingConfigurationForm = ({
  businessUnitOptions,
  canEdit,
  formId,
  isPending,
  isSequenceLocked,
  onDirtyChange,
  onValidSubmit,
  values,
}: WorkOrderBookingConfigurationFormProps) => {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(workOrderBookingFormSchema),
    values,
    resetOptions: { keepDirtyValues: true },
  });
  const { isDirty } = form.formState;
  const watched = useWatch({ control: form.control });

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const yearOptions = useMemo(() => yearModeOptions(), []);

  const businessUnitSelectOptions = useMemo(
    () => [{ value: '', label: 'None' }, ...businessUnitOptions],
    [businessUnitOptions],
  );

  const exampleWorkNumber = formatExampleWorkOrderNumber({
    prefix: watched.workOrderNumberPrefix ?? '',
    businessUnitCode: findBusinessUnitCode(
      businessUnitOptions,
      watched.workOrderNumberBusinessUnitId ?? '',
    ),
    yearMode: watched.workOrderNumberYearMode ?? 'CurrentYear',
    sequenceNumber: Number(watched.workOrderNumberSequence ?? 0),
  });

  const handleFormSubmit = (formValues: WorkOrderBookingFormValues) => {
    if (isPending || !canEdit) return;
    onValidSubmit(formValues);
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex min-h-0 flex-1 flex-col gap-4"
        id={formId}
        noValidate
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        {!canEdit ? (
          <Callout title="View only" variant="info">
            {READ_ONLY_HINT}
          </Callout>
        ) : null}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionCard padding="none" radius="panel" tone="soft">
              <div className="border-b border-border-subtle px-[18px] py-3.5">
                <SectionTitle size="sm">{SECTION_CALL_BOOKING}</SectionTitle>
              </div>
              <div className="px-[18px] py-4">
                <FormSettingSwitchField
                  description={SOURCE_REQUIRED_DESCRIPTION}
                  label={SOURCE_REQUIRED_LABEL}
                  name="sourceRequiredForCallBooking"
                  readOnly={!canEdit}
                />
                <FormSettingSwitchField
                  description={MAINTENANCE_POPUP_DESCRIPTION}
                  label={MAINTENANCE_POPUP_LABEL}
                  name="showPendingMaintenancePopupOnCallBooking"
                  readOnly={!canEdit}
                />
              </div>
            </SectionCard>

            <SectionCard padding="none" radius="panel" tone="soft">
              <div className="space-y-1 border-b border-border-subtle px-[18px] py-3.5">
                <SectionTitle size="sm">
                  {SECTION_EARLIEST_AVAILABILITY}
                </SectionTitle>
                <BodySmall color="foreground-subtle">
                  {SECTION_EARLIEST_AVAILABILITY_DESCRIPTION}
                </BodySmall>
              </div>
              <div className="grid grid-cols-1 gap-4 px-[18px] py-4 sm:grid-cols-2">
                <FormAvailabilityField
                  label={SERVICE_LABEL}
                  name="serviceEarliestAvailability"
                  readOnly={!canEdit}
                />
                <FormAvailabilityField
                  label={MAINTENANCE_LABEL}
                  name="maintenanceEarliestAvailability"
                  readOnly={!canEdit}
                />
                <FormAvailabilityField
                  label={WARRANTY_LABEL}
                  name="warrantyEarliestAvailability"
                  readOnly={!canEdit}
                />
                <FormAvailabilityField
                  label={INSTALLATION_LABEL}
                  name="installationEarliestAvailability"
                  readOnly={!canEdit}
                />
              </div>
            </SectionCard>
          </div>

          <div className="flex flex-col gap-4">
            <SectionCard padding="none" radius="panel" tone="soft">
              <div className="border-b border-border-subtle px-[18px] py-3.5">
                <SectionTitle size="sm">
                  {SECTION_WORK_ORDER_NUMBER}
                </SectionTitle>
              </div>
              <div className="space-y-4 px-[18px] py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormTextInput
                    disabled={!canEdit}
                    label={
                      <FormOptionalLabel
                        label="Prefix"
                        optionalText="(Optional)"
                      />
                    }
                    name="workOrderNumberPrefix"
                    placeholder="WO"
                  />
                  <FormSelectField
                    disabled={!canEdit}
                    label={
                      <FormOptionalLabel
                        label="BU Code"
                        optionalText="(Optional)"
                      />
                    }
                    name="workOrderNumberBusinessUnitId"
                    options={businessUnitSelectOptions}
                    placeholder="Select business unit"
                  />
                  <FormSelectField
                    disabled={!canEdit}
                    label={
                      <FormOptionalLabel
                        label="Year"
                        optionalText="(Optional)"
                      />
                    }
                    name="workOrderNumberYearMode"
                    options={yearOptions}
                  />
                  <div className="space-y-1">
                    <FormTextInput
                      disabled={!canEdit || isSequenceLocked}
                      inputMode="numeric"
                      label={SEQUENCE_NUMBER_LABEL}
                      name="workOrderNumberSequence"
                      type="number"
                    />
                    <BodySmall color="foreground-subtle">
                      {SEQUENCE_LOCKED_HINT}
                    </BodySmall>
                  </div>
                </div>
                <div className="rounded-lg border border-action/30 bg-action/5 px-3.5 py-2.5">
                  <BodySmall className="font-semibold uppercase tracking-wide text-action">
                    {EXAMPLE_WORK_NUMBER_LABEL}
                  </BodySmall>
                  <p className="text-title font-semibold text-surface-foreground">
                    {exampleWorkNumber || '—'}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard padding="none" radius="panel" tone="soft">
              <div className="space-y-1 border-b border-border-subtle px-[18px] py-3.5">
                <SectionTitle size="sm">{SECTION_CUSTOM_FIELDS}</SectionTitle>
                <BodySmall color="foreground-subtle">
                  {SECTION_CUSTOM_FIELDS_DESCRIPTION}
                </BodySmall>
              </div>
              <div className="grid grid-cols-1 gap-4 px-[18px] py-4 sm:grid-cols-2">
                <FormTextInput
                  disabled={!canEdit}
                  label={CUSTOM_FIELD_1_LABEL}
                  name="customField1Label"
                  placeholder={CUSTOM_FIELD_1_LABEL}
                />
                <FormTextInput
                  disabled={!canEdit}
                  label={CUSTOM_FIELD_2_LABEL}
                  name="customField2Label"
                  placeholder={CUSTOM_FIELD_2_LABEL}
                />
                <FormTextInput
                  disabled={!canEdit}
                  label={CUSTOM_FIELD_3_LABEL}
                  name="customField3Label"
                  placeholder={CUSTOM_FIELD_3_LABEL}
                />
                <FormTextInput
                  disabled={!canEdit}
                  label={CUSTOM_FIELD_4_LABEL}
                  name="customField4Label"
                  placeholder={CUSTOM_FIELD_4_LABEL}
                />
              </div>
            </SectionCard>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
