import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/techtrade` from the FGS Setup Service swagger
 * (`TechTrade*` DTOs).
 */
export const techTradeSummaryDtoSchema = z.object({
  id: z.number(),
  tradeCode: nullableText,
  name: nullableText,
  sortOrder: z.number().nullish(),
  isActive: z.boolean(),
});

export const techTradeDetailDtoSchema = techTradeSummaryDtoSchema.extend({
  description: nullableText,
});

export const techTradeLookupDtoSchema = z.object({
  id: z.number(),
  tradeCode: nullableText,
  name: nullableText,
  sortOrder: z.number().nullish(),
});

export const techTradeCreateDtoSchema = z.object({
  tradeCode: nullableText,
  name: nullableText,
  description: nullableText,
  sortOrder: z.number().nullish(),
});

export const techTradeUpdateDtoSchema = techTradeCreateDtoSchema;

export const techTradePatchDtoSchema = z.object({
  tradeCode: nullableText,
  name: nullableText,
  description: nullableText,
  sortOrder: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const techTradeListResponseSchema = setupResponseSchema(
  pagedResultSchema(techTradeSummaryDtoSchema),
);
export const techTradeDetailResponseSchema = setupResponseSchema(
  techTradeDetailDtoSchema,
);
export const techTradeLookupResponseSchema = setupResponseSchema(
  z.array(techTradeLookupDtoSchema),
);

export type TechTradeSummaryDto = z.infer<typeof techTradeSummaryDtoSchema>;
export type TechTradeDetailDto = z.infer<typeof techTradeDetailDtoSchema>;
export type TechTradeLookupDto = z.infer<typeof techTradeLookupDtoSchema>;
export type TechTradeCreateDto = z.infer<typeof techTradeCreateDtoSchema>;
export type TechTradeUpdateDto = z.infer<typeof techTradeUpdateDtoSchema>;
export type TechTradePatchDto = z.infer<typeof techTradePatchDtoSchema>;

export type TechTradeListParams = SetupListParams & {
  tradeCode?: string;
  name?: string;
};
