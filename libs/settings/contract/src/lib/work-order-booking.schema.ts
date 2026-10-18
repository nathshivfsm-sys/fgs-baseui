import { z } from 'zod';
import { nullableText, setupResponseSchema } from './envelope.schema';

export const earliestAvailabilityUnitSchema = z.enum(['Hours', 'Days']);

export const earliestAvailabilityRuleDtoSchema = z.object({
  duration: z.number(),
  unit: earliestAvailabilityUnitSchema,
});

export const workOrderBookingConfigDtoSchema = z.object({
  sourceRequiredForCallBooking: z.boolean(),
  showPendingMaintenancePopupOnCallBooking: z.boolean(),
  serviceEarliestAvailability: earliestAvailabilityRuleDtoSchema,
  maintenanceEarliestAvailability: earliestAvailabilityRuleDtoSchema,
  warrantyEarliestAvailability: earliestAvailabilityRuleDtoSchema,
  installationEarliestAvailability: earliestAvailabilityRuleDtoSchema,
  workOrderNumberPrefix: nullableText,
  workOrderNumberBusinessUnitId: z.number().nullish(),
  workOrderNumberYearMode: z.enum(['CurrentYear', 'Blank']),
  workOrderNumberSequence: z.number(),
  isWorkOrderNumberSequenceLocked: z.boolean(),
  customField1Label: nullableText,
  customField2Label: nullableText,
  customField3Label: nullableText,
  customField4Label: nullableText,
  canEdit: z.boolean(),
  updatedBy: nullableText,
  updatedOn: nullableText,
});

export const workOrderBookingConfigUpdateDtoSchema =
  workOrderBookingConfigDtoSchema.omit({
    canEdit: true,
    updatedBy: true,
    updatedOn: true,
    isWorkOrderNumberSequenceLocked: true,
  });

export const workOrderBookingConfigResponseSchema = setupResponseSchema(
  workOrderBookingConfigDtoSchema,
);

export type EarliestAvailabilityUnit = z.infer<
  typeof earliestAvailabilityUnitSchema
>;
export type EarliestAvailabilityRuleDto = z.infer<
  typeof earliestAvailabilityRuleDtoSchema
>;
export type WorkOrderBookingConfigDto = z.infer<
  typeof workOrderBookingConfigDtoSchema
>;
export type WorkOrderBookingConfigUpdateDto = z.infer<
  typeof workOrderBookingConfigUpdateDtoSchema
>;
