import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/timeslot` from the FGS Setup Service swagger
 * (`Timeslot*` DTOs). `date-span` fields stay strings (`HH:mm:ss`).
 */
export const timeslotSummaryDtoSchema = z.object({
  id: z.number(),
  fgsSetupZoneId: z.number().nullish(),
  code: nullableText,
  name: nullableText,
  beginTime: z.string(),
  endTime: z.string(),
  markTechArrivedLateAfter: nullableText,
  markWorkOrderDelayedCompletionAfter: nullableText,
  isMobileVisible: z.boolean(),
  isCustomerPortalVisible: z.boolean(),
  includeInCapacityPlanning: z.boolean(),
  showToExternalSystem: z.boolean(),
  isActive: z.boolean(),
});

export const timeslotDetailDtoSchema = timeslotSummaryDtoSchema;

export const timeslotLookupDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
});

export const timeslotCreateDtoSchema = z.object({
  fgsSetupZoneId: z.number().nullish(),
  code: nullableText,
  name: nullableText,
  beginTime: z.string(),
  endTime: z.string(),
  markTechArrivedLateAfter: nullableText,
  markWorkOrderDelayedCompletionAfter: nullableText,
  isMobileVisible: z.boolean(),
  isCustomerPortalVisible: z.boolean(),
  includeInCapacityPlanning: z.boolean(),
  showToExternalSystem: z.boolean(),
});

export const timeslotUpdateDtoSchema = timeslotCreateDtoSchema;

export const timeslotPatchDtoSchema = z.object({
  fgsSetupZoneId: z.number().nullish(),
  code: nullableText,
  name: nullableText,
  beginTime: nullableText,
  endTime: nullableText,
  markTechArrivedLateAfter: nullableText,
  markWorkOrderDelayedCompletionAfter: nullableText,
  isMobileVisible: z.boolean().nullish(),
  isCustomerPortalVisible: z.boolean().nullish(),
  includeInCapacityPlanning: z.boolean().nullish(),
  showToExternalSystem: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const timeslotListResponseSchema = setupResponseSchema(
  pagedResultSchema(timeslotSummaryDtoSchema),
);
export const timeslotDetailResponseSchema = setupResponseSchema(
  timeslotDetailDtoSchema,
);
export const timeslotLookupResponseSchema = setupResponseSchema(
  z.array(timeslotLookupDtoSchema),
);

export type TimeslotSummaryDto = z.infer<typeof timeslotSummaryDtoSchema>;
export type TimeslotDetailDto = z.infer<typeof timeslotDetailDtoSchema>;
export type TimeslotLookupDto = z.infer<typeof timeslotLookupDtoSchema>;
export type TimeslotCreateDto = z.infer<typeof timeslotCreateDtoSchema>;
export type TimeslotUpdateDto = z.infer<typeof timeslotUpdateDtoSchema>;
export type TimeslotPatchDto = z.infer<typeof timeslotPatchDtoSchema>;

export type TimeslotListParams = SetupListParams & {
  code?: string;
  name?: string;
};

export type TimeslotLookupParams = {
  activeOnly?: boolean;
  isMobileVisible?: boolean;
  isCustomerPortalVisible?: boolean;
};
