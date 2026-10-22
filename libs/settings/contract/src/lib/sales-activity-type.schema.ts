import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/salesactivitytype` from the FGS Setup Service swagger
 * (`FgsSalesActivityType*` DTOs).
 */
export const salesActivityTypeSummaryDtoSchema = z.object({
  id: z.number(),
  activityTypeCode: nullableText,
  activityTypeName: nullableText,
  description: nullableText,
  displayOrder: z.number(),
  isSystem: z.boolean(),
  appliesToLead: z.boolean(),
  appliesToOpportunity: z.boolean(),
  allowManualSelection: z.boolean(),
  isActive: z.boolean(),
});

export const salesActivityTypeDetailDtoSchema =
  salesActivityTypeSummaryDtoSchema;

export const salesActivityTypeLookupDtoSchema = z.object({
  id: z.number(),
  activityTypeCode: nullableText,
  activityTypeName: nullableText,
  displayOrder: z.number(),
});

export const salesActivityTypeCreateDtoSchema = z.object({
  activityTypeCode: nullableText,
  activityTypeName: nullableText,
  description: nullableText,
  isSystem: z.boolean(),
  appliesToLead: z.boolean(),
  appliesToOpportunity: z.boolean(),
  allowManualSelection: z.boolean(),
  displayOrder: z.number().nullish(),
});

export const salesActivityTypeUpdateDtoSchema = z.object({
  activityTypeCode: nullableText,
  activityTypeName: nullableText,
  description: nullableText,
  displayOrder: z.number(),
  isSystem: z.boolean(),
  appliesToLead: z.boolean(),
  appliesToOpportunity: z.boolean(),
  allowManualSelection: z.boolean(),
});

export const salesActivityTypePatchDtoSchema = z.object({
  activityTypeCode: nullableText,
  activityTypeName: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isSystem: z.boolean().nullish(),
  appliesToLead: z.boolean().nullish(),
  appliesToOpportunity: z.boolean().nullish(),
  allowManualSelection: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const salesActivityTypeListResponseSchema = setupResponseSchema(
  pagedResultSchema(salesActivityTypeSummaryDtoSchema),
);
export const salesActivityTypeDetailResponseSchema = setupResponseSchema(
  salesActivityTypeDetailDtoSchema,
);
export const salesActivityTypeLookupResponseSchema = setupResponseSchema(
  z.array(salesActivityTypeLookupDtoSchema),
);

export type SalesActivityTypeSummaryDto = z.infer<
  typeof salesActivityTypeSummaryDtoSchema
>;
export type SalesActivityTypeDetailDto = z.infer<
  typeof salesActivityTypeDetailDtoSchema
>;
export type SalesActivityTypeLookupDto = z.infer<
  typeof salesActivityTypeLookupDtoSchema
>;
export type SalesActivityTypeCreateDto = z.infer<
  typeof salesActivityTypeCreateDtoSchema
>;
export type SalesActivityTypeUpdateDto = z.infer<
  typeof salesActivityTypeUpdateDtoSchema
>;
export type SalesActivityTypePatchDto = z.infer<
  typeof salesActivityTypePatchDtoSchema
>;

export type SalesActivityTypeListParams = SetupListParams & {
  activityTypeCode?: string;
  activityTypeName?: string;
};
