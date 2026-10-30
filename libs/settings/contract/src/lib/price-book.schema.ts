import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/pricebook` from the FGS Setup Service swagger
 * (`FgsPriceBook*` DTOs).
 */
export const priceBookSummaryDtoSchema = z.object({
  id: z.number(),
  priceBookCode: nullableText,
  priceBookName: nullableText,
  jobTypeId: z.number(),
  pricingModel: nullableText,
  estimatedDurationMinutes: z.number(),
  basePrice: z.number().nullish(),
  isTaxable: z.boolean(),
  isActive: z.boolean(),
});

export const priceBookDetailDtoSchema = priceBookSummaryDtoSchema.extend({
  description: nullableText,
});

export const priceBookLookupDtoSchema = z.object({
  id: z.number(),
  priceBookCode: nullableText,
  priceBookName: nullableText,
  pricingModel: nullableText,
});

export const priceBookCreateDtoSchema = z.object({
  priceBookCode: nullableText,
  priceBookName: nullableText,
  description: nullableText,
  jobTypeId: z.number(),
  pricingModel: nullableText,
  estimatedDurationMinutes: z.number(),
  basePrice: z.number().nullish(),
  isTaxable: z.boolean(),
});

export const priceBookUpdateDtoSchema = priceBookCreateDtoSchema;

export const priceBookPatchDtoSchema = z.object({
  priceBookCode: nullableText,
  priceBookName: nullableText,
  description: nullableText,
  jobTypeId: z.number().nullish(),
  pricingModel: nullableText,
  estimatedDurationMinutes: z.number().nullish(),
  basePrice: z.number().nullish(),
  isTaxable: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const priceBookListResponseSchema = setupResponseSchema(
  pagedResultSchema(priceBookSummaryDtoSchema),
);
export const priceBookDetailResponseSchema = setupResponseSchema(
  priceBookDetailDtoSchema,
);
export const priceBookLookupResponseSchema = setupResponseSchema(
  z.array(priceBookLookupDtoSchema),
);

export type PriceBookSummaryDto = z.infer<typeof priceBookSummaryDtoSchema>;
export type PriceBookDetailDto = z.infer<typeof priceBookDetailDtoSchema>;
export type PriceBookLookupDto = z.infer<typeof priceBookLookupDtoSchema>;
export type PriceBookCreateDto = z.infer<typeof priceBookCreateDtoSchema>;
export type PriceBookUpdateDto = z.infer<typeof priceBookUpdateDtoSchema>;
export type PriceBookPatchDto = z.infer<typeof priceBookPatchDtoSchema>;

export type PriceBookListParams = SetupListParams & {
  jobTypeId?: number;
  pricingModel?: string;
  priceBookCode?: string;
  priceBookName?: string;
};
