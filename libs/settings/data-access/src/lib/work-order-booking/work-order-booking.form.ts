import { z } from 'zod';
import type {
  WorkOrderBookingConfigDto,
  WorkOrderBookingConfigUpdateDto,
} from '@cms/settings-contract';

const positiveInteger = z.coerce
  .number()
  .int('Enter a whole number')
  .positive('Enter a value greater than zero');

const availabilityRuleFormSchema = z.object({
  duration: positiveInteger,
  unit: z.enum(['Hours', 'Days']),
});

export const workOrderBookingFormSchema = z.object({
  sourceRequiredForCallBooking: z.boolean(),
  showPendingMaintenancePopupOnCallBooking: z.boolean(),
  serviceEarliestAvailability: availabilityRuleFormSchema,
  maintenanceEarliestAvailability: availabilityRuleFormSchema,
  warrantyEarliestAvailability: availabilityRuleFormSchema,
  installationEarliestAvailability: availabilityRuleFormSchema,
  workOrderNumberPrefix: z.string(),
  workOrderNumberBusinessUnitId: z.string(),
  workOrderNumberYearMode: z.enum(['CurrentYear', 'Blank']),
  workOrderNumberSequence: positiveInteger,
  customField1Label: z.string(),
  customField2Label: z.string(),
  customField3Label: z.string(),
  customField4Label: z.string(),
});

export type WorkOrderBookingFormValues = z.infer<
  typeof workOrderBookingFormSchema
>;

export type WorkOrderBookingFormMeta = {
  isWorkOrderNumberSequenceLocked: boolean;
  canEdit: boolean;
};

export const emptyWorkOrderBookingFormValues =
  (): WorkOrderBookingFormValues => ({
    sourceRequiredForCallBooking: false,
    showPendingMaintenancePopupOnCallBooking: false,
    serviceEarliestAvailability: { duration: 2, unit: 'Hours' },
    maintenanceEarliestAvailability: { duration: 1, unit: 'Days' },
    warrantyEarliestAvailability: { duration: 4, unit: 'Hours' },
    installationEarliestAvailability: { duration: 2, unit: 'Days' },
    workOrderNumberPrefix: '',
    workOrderNumberBusinessUnitId: '',
    workOrderNumberYearMode: 'CurrentYear',
    workOrderNumberSequence: 1,
    customField1Label: '',
    customField2Label: '',
    customField3Label: '',
    customField4Label: '',
  });

export const toWorkOrderBookingFormValues = (
  config: WorkOrderBookingConfigDto,
): WorkOrderBookingFormValues => ({
  sourceRequiredForCallBooking: config.sourceRequiredForCallBooking,
  showPendingMaintenancePopupOnCallBooking:
    config.showPendingMaintenancePopupOnCallBooking,
  serviceEarliestAvailability: config.serviceEarliestAvailability,
  maintenanceEarliestAvailability: config.maintenanceEarliestAvailability,
  warrantyEarliestAvailability: config.warrantyEarliestAvailability,
  installationEarliestAvailability: config.installationEarliestAvailability,
  workOrderNumberPrefix: config.workOrderNumberPrefix?.trim() ?? '',
  workOrderNumberBusinessUnitId:
    config.workOrderNumberBusinessUnitId != null
      ? String(config.workOrderNumberBusinessUnitId)
      : '',
  workOrderNumberYearMode: config.workOrderNumberYearMode,
  workOrderNumberSequence: config.workOrderNumberSequence,
  customField1Label: config.customField1Label?.trim() ?? '',
  customField2Label: config.customField2Label?.trim() ?? '',
  customField3Label: config.customField3Label?.trim() ?? '',
  customField4Label: config.customField4Label?.trim() ?? '',
});

export const toWorkOrderBookingFormMeta = (
  config: WorkOrderBookingConfigDto,
): WorkOrderBookingFormMeta => ({
  isWorkOrderNumberSequenceLocked: config.isWorkOrderNumberSequenceLocked,
  canEdit: config.canEdit,
});

const optionalText = (value: string) => {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

const optionalBusinessUnitId = (value: string) => {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  return Number(trimmed);
};

export const toWorkOrderBookingConfigUpdateDto = (
  values: WorkOrderBookingFormValues,
): WorkOrderBookingConfigUpdateDto => ({
  sourceRequiredForCallBooking: values.sourceRequiredForCallBooking,
  showPendingMaintenancePopupOnCallBooking:
    values.showPendingMaintenancePopupOnCallBooking,
  serviceEarliestAvailability: values.serviceEarliestAvailability,
  maintenanceEarliestAvailability: values.maintenanceEarliestAvailability,
  warrantyEarliestAvailability: values.warrantyEarliestAvailability,
  installationEarliestAvailability: values.installationEarliestAvailability,
  workOrderNumberPrefix: optionalText(values.workOrderNumberPrefix),
  workOrderNumberBusinessUnitId: optionalBusinessUnitId(
    values.workOrderNumberBusinessUnitId,
  ),
  workOrderNumberYearMode: values.workOrderNumberYearMode,
  workOrderNumberSequence: values.workOrderNumberSequence,
  customField1Label: optionalText(values.customField1Label),
  customField2Label: optionalText(values.customField2Label),
  customField3Label: optionalText(values.customField3Label),
  customField4Label: optionalText(values.customField4Label),
});

export type ExampleWorkOrderNumberInput = {
  prefix: string;
  businessUnitCode: string;
  yearMode: 'CurrentYear' | 'Blank';
  sequenceNumber: number;
};

export const formatExampleWorkOrderNumber = ({
  prefix,
  businessUnitCode,
  yearMode,
  sequenceNumber,
}: ExampleWorkOrderNumberInput): string => {
  const parts: string[] = [];
  const trimmedPrefix = prefix.trim();
  if (trimmedPrefix) parts.push(trimmedPrefix);
  const trimmedBu = businessUnitCode.trim();
  if (trimmedBu) parts.push(trimmedBu);
  if (yearMode === 'CurrentYear') {
    parts.push(String(new Date().getFullYear()));
  }
  if (Number.isFinite(sequenceNumber) && sequenceNumber > 0) {
    parts.push(String(Math.trunc(sequenceNumber)).padStart(5, '0'));
  }
  return parts.join('-');
};
