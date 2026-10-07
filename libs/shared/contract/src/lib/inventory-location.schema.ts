import { z } from 'zod';
import { apiResponseSchema, nullableText } from './envelope.schema';

/**
 * Wire shapes of `/inventorylocation/lookup` from the FGS Inventory Service swagger
 * (`FgsInventoryLocationLookupDto`).
 */
export const inventoryLocationLookupDtoSchema = z.object({
  id: z.number(),
  inventoryLocationCode: nullableText,
  name: nullableText,
});

export const inventoryLocationLookupResponseSchema = apiResponseSchema(
  z.array(inventoryLocationLookupDtoSchema),
);

export type InventoryLocationLookupDto = z.infer<
  typeof inventoryLocationLookupDtoSchema
>;

export type InventoryLocationLookupParams = {
  activeOnly?: boolean;
  locationType?:
    | 'warehouse'
    | 'truck'
    | 'trailer'
    | 'jobSite'
    | 'consignment'
    | 'vendor';
};
