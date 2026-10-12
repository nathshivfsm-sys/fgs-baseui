import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/salespipelinestatus` from the FGS Setup Service swagger
 * (`FgsSalesPipelineStatus*` DTOs).
 */
export const salesPipelineStatusSummaryDtoSchema = z.object({
  id: z.number(),
  statusCode: nullableText,
  statusName: nullableText,
  description: nullableText,
  displayOrder: z.number(),
  isSystem: z.boolean(),
  appliesToLead: z.boolean(),
  appliesToOpportunity: z.boolean(),
  isTerminal: z.boolean(),
  allowManualSelection: z.boolean(),
  isActive: z.boolean(),
});

export const salesPipelineStatusDetailDtoSchema =
  salesPipelineStatusSummaryDtoSchema;

export const salesPipelineStatusLookupDtoSchema = z.object({
  id: z.number(),
  statusCode: nullableText,
  statusName: nullableText,
  displayOrder: z.number(),
});

export const salesPipelineStatusCreateDtoSchema = z.object({
  statusCode: nullableText,
  statusName: nullableText,
  description: nullableText,
  isSystem: z.boolean(),
  appliesToLead: z.boolean(),
  appliesToOpportunity: z.boolean(),
  isTerminal: z.boolean(),
  allowManualSelection: z.boolean(),
  displayOrder: z.number().nullish(),
});

export const salesPipelineStatusUpdateDtoSchema = z.object({
  statusCode: nullableText,
  statusName: nullableText,
  description: nullableText,
  displayOrder: z.number(),
  isSystem: z.boolean(),
  appliesToLead: z.boolean(),
  appliesToOpportunity: z.boolean(),
  isTerminal: z.boolean(),
  allowManualSelection: z.boolean(),
});

export const salesPipelineStatusPatchDtoSchema = z.object({
  statusCode: nullableText,
  statusName: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isSystem: z.boolean().nullish(),
  appliesToLead: z.boolean().nullish(),
  appliesToOpportunity: z.boolean().nullish(),
  isTerminal: z.boolean().nullish(),
  allowManualSelection: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const salesPipelineStatusListResponseSchema = setupResponseSchema(
  pagedResultSchema(salesPipelineStatusSummaryDtoSchema),
);
export const salesPipelineStatusDetailResponseSchema = setupResponseSchema(
  salesPipelineStatusDetailDtoSchema,
);
export const salesPipelineStatusLookupResponseSchema = setupResponseSchema(
  z.array(salesPipelineStatusLookupDtoSchema),
);

export type SalesPipelineStatusSummaryDto = z.infer<
  typeof salesPipelineStatusSummaryDtoSchema
>;
export type SalesPipelineStatusDetailDto = z.infer<
  typeof salesPipelineStatusDetailDtoSchema
>;
export type SalesPipelineStatusLookupDto = z.infer<
  typeof salesPipelineStatusLookupDtoSchema
>;
export type SalesPipelineStatusCreateDto = z.infer<
  typeof salesPipelineStatusCreateDtoSchema
>;
export type SalesPipelineStatusUpdateDto = z.infer<
  typeof salesPipelineStatusUpdateDtoSchema
>;
export type SalesPipelineStatusPatchDto = z.infer<
  typeof salesPipelineStatusPatchDtoSchema
>;

export type SalesPipelineStatusListParams = SetupListParams & {
  statusCode?: string;
  statusName?: string;
};
