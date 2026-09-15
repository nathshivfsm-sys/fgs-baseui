import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

const nullableNumber = z.number().nullish();

/**
 * Wire shapes of `/glbreak` from the FGS Setup Service swagger
 * (`GLBreak*` DTOs plus `LocationWriteDto` on writes).
 */
export const glBreakAddressDetailDtoSchema = z.object({
  id: z.string(),
  addressLine1: nullableText,
  addressLine2: nullableText,
  addressLine3: nullableText,
  addressLine4: nullableText,
  city: nullableText,
  state: nullableText,
  country: nullableText,
  postalCode: nullableText,
  formattedAddress: nullableText,
  latitude: nullableNumber,
  longitude: nullableNumber,
});

export const glBreakLocationWriteDtoSchema = z.object({
  addressLine1: nullableText,
  addressLine2: nullableText,
  addressLine3: nullableText,
  addressLine4: nullableText,
  city: nullableText,
  state: nullableText,
  county: nullableText,
  country: nullableText,
  postalCode: nullableText,
  formattedAddress: nullableText,
  latitude: nullableNumber,
  longitude: nullableNumber,
  placeId: nullableText,
});

export const glBreakTradeDtoSchema = z.object({
  id: z.number(),
  tradeCode: nullableText,
});

export const glBreakSummaryDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  breakLabel: nullableText,
  breakLevel: z.number(),
  logoFileId: nullableNumber,
  isActive: z.boolean(),
});

export const glBreakDetailDtoSchema = glBreakSummaryDtoSchema.extend({
  address: glBreakAddressDetailDtoSchema.nullish(),
  trades: z.array(glBreakTradeDtoSchema).nullish(),
});

export const glBreakLookupDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  breakLevel: z.number(),
});

export const glBreakCreateDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  breakLabel: nullableText,
  breakLevel: z.number(),
  logoFileId: nullableNumber,
  address: glBreakLocationWriteDtoSchema.nullish(),
  tradeCodes: z.array(z.string()).nullish(),
});

export const glBreakUpdateDtoSchema = glBreakCreateDtoSchema;

export const glBreakPatchDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  breakLabel: nullableText,
  breakLevel: nullableNumber,
  logoFileId: nullableNumber,
  address: glBreakLocationWriteDtoSchema.nullish(),
  tradeCodes: z.array(z.string()).nullish(),
  isActive: z.boolean().nullish(),
});

export const glBreakListResponseSchema = setupResponseSchema(
  pagedResultSchema(glBreakSummaryDtoSchema),
);
export const glBreakDetailResponseSchema = setupResponseSchema(
  glBreakDetailDtoSchema,
);
export const glBreakLookupResponseSchema = setupResponseSchema(
  z.array(glBreakLookupDtoSchema),
);

export type GlBreakAddressDetailDto = z.infer<
  typeof glBreakAddressDetailDtoSchema
>;
export type GlBreakLocationWriteDto = z.infer<
  typeof glBreakLocationWriteDtoSchema
>;
export type GlBreakTradeDto = z.infer<typeof glBreakTradeDtoSchema>;
export type GlBreakSummaryDto = z.infer<typeof glBreakSummaryDtoSchema>;
export type GlBreakDetailDto = z.infer<typeof glBreakDetailDtoSchema>;
export type GlBreakLookupDto = z.infer<typeof glBreakLookupDtoSchema>;
export type GlBreakCreateDto = z.infer<typeof glBreakCreateDtoSchema>;
export type GlBreakUpdateDto = z.infer<typeof glBreakUpdateDtoSchema>;
export type GlBreakPatchDto = z.infer<typeof glBreakPatchDtoSchema>;

export type GlBreakListParams = SetupListParams & {
  code?: string;
  name?: string;
  breakLevel?: number;
  tradeCode?: string;
};
