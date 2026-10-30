import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/pricebookitem` from the FGS Setup Service swagger
 * (`FgsPriceBookItem*` DTOs). This resource has no `isActive` field.
 * Create leaves `displayOrder` optional; update requires it.
 * Swagger puts `notes` on the detail DTO only. It is nullish on the summary
 * so a list that omits it still parses, and a list that includes it keeps it.
 */
export const priceBookItemSummaryDtoSchema = z.object({
  id: z.number(),
  priceBookId: z.number(),
  inventoryItemId: z.number().nullish(),
  itemCode: nullableText,
  itemDescription: nullableText,
  quantity: z.number(),
  displayOrder: z.number(),
  /**
   * Present on detail. List responses omit it in swagger; keep it nullish so a
   * payload that does include notes (the in-memory mock does) still parses.
   * The price book screen stores the line tab here: material, equipment, or other.
   */
  notes: nullableText,
});

export const priceBookItemDetailDtoSchema =
  priceBookItemSummaryDtoSchema.extend({
    notes: nullableText,
  });

export const priceBookItemLookupDtoSchema = z.object({
  id: z.number(),
  priceBookId: z.number(),
  itemCode: nullableText,
  itemDescription: nullableText,
  displayOrder: z.number(),
});

export const priceBookItemCreateDtoSchema = z.object({
  priceBookId: z.number(),
  inventoryItemId: z.number().nullish(),
  itemCode: nullableText,
  itemDescription: nullableText,
  quantity: z.number(),
  notes: nullableText,
  displayOrder: z.number().nullish(),
});

export const priceBookItemUpdateDtoSchema = z.object({
  priceBookId: z.number(),
  inventoryItemId: z.number().nullish(),
  itemCode: nullableText,
  itemDescription: nullableText,
  quantity: z.number(),
  displayOrder: z.number(),
  notes: nullableText,
});

export const priceBookItemPatchDtoSchema = z.object({
  priceBookId: z.number().nullish(),
  inventoryItemId: z.number().nullish(),
  itemCode: nullableText,
  itemDescription: nullableText,
  quantity: z.number().nullish(),
  displayOrder: z.number().nullish(),
  notes: nullableText,
});

export const priceBookItemListResponseSchema = setupResponseSchema(
  pagedResultSchema(priceBookItemSummaryDtoSchema),
);
export const priceBookItemDetailResponseSchema = setupResponseSchema(
  priceBookItemDetailDtoSchema,
);
export const priceBookItemLookupResponseSchema = setupResponseSchema(
  z.array(priceBookItemLookupDtoSchema),
);

export type PriceBookItemSummaryDto = z.infer<
  typeof priceBookItemSummaryDtoSchema
>;
export type PriceBookItemDetailDto = z.infer<
  typeof priceBookItemDetailDtoSchema
>;
export type PriceBookItemLookupDto = z.infer<
  typeof priceBookItemLookupDtoSchema
>;
export type PriceBookItemCreateDto = z.infer<
  typeof priceBookItemCreateDtoSchema
>;
export type PriceBookItemUpdateDto = z.infer<
  typeof priceBookItemUpdateDtoSchema
>;
export type PriceBookItemPatchDto = z.infer<typeof priceBookItemPatchDtoSchema>;

export type PriceBookItemListParams = SetupListParams & {
  priceBookId?: number;
  itemCode?: string;
  itemDescription?: string;
};

/** Lookup filters by price book. Swagger has no `activeOnly` on this route. */
export type PriceBookItemLookupParams = {
  priceBookId?: number;
};
