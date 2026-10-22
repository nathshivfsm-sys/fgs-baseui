import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/salesactivityoutcome` from the FGS Setup Service swagger
 * (`FgsSalesActivityOutcome*` DTOs).
 */
export const salesActivityOutcomeSummaryDtoSchema = z.object({
  id: z.number(),
  outcomeCode: nullableText,
  outcomeName: nullableText,
  description: nullableText,
  displayOrder: z.number(),
  isSystem: z.boolean(),
  appliesToLead: z.boolean(),
  appliesToOpportunity: z.boolean(),
  nextSalesPipelineStatusId: z.number().nullish(),
  isTerminal: z.boolean(),
  requireComment: z.boolean(),
  allowManualSelection: z.boolean(),
  isActive: z.boolean(),
});

export const salesActivityOutcomeDetailDtoSchema =
  salesActivityOutcomeSummaryDtoSchema;

export const salesActivityOutcomeLookupDtoSchema = z.object({
  id: z.number(),
  outcomeCode: nullableText,
  outcomeName: nullableText,
  displayOrder: z.number(),
});

export const salesActivityOutcomeCreateDtoSchema = z.object({
  outcomeCode: nullableText,
  outcomeName: nullableText,
  description: nullableText,
  isSystem: z.boolean(),
  appliesToLead: z.boolean(),
  appliesToOpportunity: z.boolean(),
  nextSalesPipelineStatusId: z.number().nullish(),
  isTerminal: z.boolean(),
  requireComment: z.boolean(),
  allowManualSelection: z.boolean(),
  displayOrder: z.number().nullish(),
});

export const salesActivityOutcomeUpdateDtoSchema = z.object({
  outcomeCode: nullableText,
  outcomeName: nullableText,
  description: nullableText,
  displayOrder: z.number(),
  isSystem: z.boolean(),
  appliesToLead: z.boolean(),
  appliesToOpportunity: z.boolean(),
  nextSalesPipelineStatusId: z.number().nullish(),
  isTerminal: z.boolean(),
  requireComment: z.boolean(),
  allowManualSelection: z.boolean(),
});

export const salesActivityOutcomePatchDtoSchema = z.object({
  outcomeCode: nullableText,
  outcomeName: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isSystem: z.boolean().nullish(),
  appliesToLead: z.boolean().nullish(),
  appliesToOpportunity: z.boolean().nullish(),
  nextSalesPipelineStatusId: z.number().nullish(),
  isTerminal: z.boolean().nullish(),
  requireComment: z.boolean().nullish(),
  allowManualSelection: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const salesActivityOutcomeListResponseSchema = setupResponseSchema(
  pagedResultSchema(salesActivityOutcomeSummaryDtoSchema),
);
export const salesActivityOutcomeDetailResponseSchema = setupResponseSchema(
  salesActivityOutcomeDetailDtoSchema,
);
export const salesActivityOutcomeLookupResponseSchema = setupResponseSchema(
  z.array(salesActivityOutcomeLookupDtoSchema),
);

export type SalesActivityOutcomeSummaryDto = z.infer<
  typeof salesActivityOutcomeSummaryDtoSchema
>;
export type SalesActivityOutcomeDetailDto = z.infer<
  typeof salesActivityOutcomeDetailDtoSchema
>;
export type SalesActivityOutcomeLookupDto = z.infer<
  typeof salesActivityOutcomeLookupDtoSchema
>;
export type SalesActivityOutcomeCreateDto = z.infer<
  typeof salesActivityOutcomeCreateDtoSchema
>;
export type SalesActivityOutcomeUpdateDto = z.infer<
  typeof salesActivityOutcomeUpdateDtoSchema
>;
export type SalesActivityOutcomePatchDto = z.infer<
  typeof salesActivityOutcomePatchDtoSchema
>;

export type SalesActivityOutcomeListParams = SetupListParams & {
  outcomeCode?: string;
  outcomeName?: string;
};
