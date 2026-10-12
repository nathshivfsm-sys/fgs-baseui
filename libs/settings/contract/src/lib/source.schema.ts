import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/source` from the FGS Setup Service swagger (`Source*` DTOs).
 */
export const sourceSummaryDtoSchema = z.object({
  id: z.number(),
  sourceCode: nullableText,
  sourceName: nullableText,
  description: nullableText,
  isActive: z.boolean(),
});

export const sourceDetailDtoSchema = sourceSummaryDtoSchema;

export const sourceLookupDtoSchema = z.object({
  id: z.number(),
  sourceCode: nullableText,
  sourceName: nullableText,
});

export const sourceCreateDtoSchema = z.object({
  sourceCode: nullableText,
  sourceName: nullableText,
  description: nullableText,
});

export const sourceUpdateDtoSchema = sourceCreateDtoSchema;

export const sourcePatchDtoSchema = z.object({
  sourceCode: nullableText,
  sourceName: nullableText,
  description: nullableText,
  isActive: z.boolean().nullish(),
});

export const sourceListResponseSchema = setupResponseSchema(
  pagedResultSchema(sourceSummaryDtoSchema),
);
export const sourceDetailResponseSchema =
  setupResponseSchema(sourceDetailDtoSchema);
export const sourceLookupResponseSchema = setupResponseSchema(
  z.array(sourceLookupDtoSchema),
);

export type SourceSummaryDto = z.infer<typeof sourceSummaryDtoSchema>;
export type SourceDetailDto = z.infer<typeof sourceDetailDtoSchema>;
export type SourceLookupDto = z.infer<typeof sourceLookupDtoSchema>;
export type SourceCreateDto = z.infer<typeof sourceCreateDtoSchema>;
export type SourceUpdateDto = z.infer<typeof sourceUpdateDtoSchema>;
export type SourcePatchDto = z.infer<typeof sourcePatchDtoSchema>;

export type SourceListParams = SetupListParams & {
  sourceCode?: string;
  sourceName?: string;
};
