import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/nonworkingdate` from the FGS Setup Service swagger
 * (`FgsNonWorkingDate*` DTOs).
 */
export const nonWorkingDateSummaryDtoSchema = z.object({
  id: z.number(),
  nonWorkingDate: z.string(),
  name: nullableText,
  isActive: z.boolean(),
});

export const nonWorkingDateDetailDtoSchema = nonWorkingDateSummaryDtoSchema;

export const nonWorkingDateLookupDtoSchema = z.object({
  id: z.number(),
  nonWorkingDate: z.string(),
  name: nullableText,
});

export const nonWorkingDateCreateDtoSchema = z.object({
  nonWorkingDate: z.string(),
  name: nullableText,
});

export const nonWorkingDateUpdateDtoSchema = nonWorkingDateCreateDtoSchema;

export const nonWorkingDatePatchDtoSchema = z.object({
  nonWorkingDate: z.string().nullish(),
  name: nullableText,
  isActive: z.boolean().nullish(),
});

export const nonWorkingDateListResponseSchema = setupResponseSchema(
  pagedResultSchema(nonWorkingDateSummaryDtoSchema),
);
export const nonWorkingDateDetailResponseSchema = setupResponseSchema(
  nonWorkingDateDetailDtoSchema,
);
export const nonWorkingDateLookupResponseSchema = setupResponseSchema(
  z.array(nonWorkingDateLookupDtoSchema),
);

export type NonWorkingDateSummaryDto = z.infer<
  typeof nonWorkingDateSummaryDtoSchema
>;
export type NonWorkingDateDetailDto = z.infer<
  typeof nonWorkingDateDetailDtoSchema
>;
export type NonWorkingDateLookupDto = z.infer<
  typeof nonWorkingDateLookupDtoSchema
>;
export type NonWorkingDateCreateDto = z.infer<
  typeof nonWorkingDateCreateDtoSchema
>;
export type NonWorkingDateUpdateDto = z.infer<
  typeof nonWorkingDateUpdateDtoSchema
>;
export type NonWorkingDatePatchDto = z.infer<
  typeof nonWorkingDatePatchDtoSchema
>;

export type NonWorkingDateListParams = SetupListParams & {
  nonWorkingDate?: string;
  name?: string;
};
