import { z } from 'zod';
import type {
  PriceBookItemCreateDto,
  PriceBookItemSummaryDto,
  PriceBookItemUpdateDto,
} from '@cms/settings-contract';

/** Stored in `notes` so Material, Equipment, and Other can share one item API. */
export const PRICE_BOOK_LINE_MATERIAL = 'material';
export const PRICE_BOOK_LINE_EQUIPMENT = 'equipment';
export const PRICE_BOOK_LINE_OTHER = 'other';

const LINE_KINDS = [
  PRICE_BOOK_LINE_MATERIAL,
  PRICE_BOOK_LINE_EQUIPMENT,
  PRICE_BOOK_LINE_OTHER,
] as const;

export type PriceBookLineKind = (typeof LINE_KINDS)[number];

const QUANTITY = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/;

export const priceBookItemFormSchema = z.object({
  itemCode: z
    .string()
    .trim()
    .min(1, 'This field is required.')
    .max(100, 'Must be at most 100 characters.'),
  itemDescription: z
    .string()
    .trim()
    .max(500, 'Description must be at most 500 characters.'),
  quantity: z
    .string()
    .trim()
    .refine((value) => QUANTITY.test(value) && Number(value) > 0, {
      message: 'Enter a quantity greater than 0.',
    }),
});

export type PriceBookItemForm = z.infer<typeof priceBookItemFormSchema>;

export const emptyPriceBookItemForm = (): PriceBookItemForm => ({
  itemCode: '',
  itemDescription: '',
  quantity: '1',
});

export const toPriceBookItemFormValues = (
  record: PriceBookItemSummaryDto,
): PriceBookItemForm => ({
  itemCode: record.itemCode ?? '',
  itemDescription: record.itemDescription ?? '',
  quantity: String(record.quantity),
});

/**
 * Lines with no tab marker stay on Material. That covers items created
 * before this screen, whose notes are free text.
 */
export const priceBookLineKind = (
  notes: string | null | undefined,
): PriceBookLineKind => {
  if (
    notes === PRICE_BOOK_LINE_EQUIPMENT ||
    notes === PRICE_BOOK_LINE_OTHER ||
    notes === PRICE_BOOK_LINE_MATERIAL
  ) {
    return notes;
  }
  return PRICE_BOOK_LINE_MATERIAL;
};

const toItemFields = (values: PriceBookItemForm, kind: PriceBookLineKind) => ({
  itemCode: values.itemCode,
  itemDescription: values.itemDescription ? values.itemDescription : null,
  quantity: Number(values.quantity),
  notes: kind,
});

export const toPriceBookItemCreateDto = (
  values: PriceBookItemForm,
  priceBookId: number,
  kind: PriceBookLineKind,
  displayOrder: number,
): PriceBookItemCreateDto => ({
  priceBookId,
  inventoryItemId: null,
  displayOrder,
  ...toItemFields(values, kind),
});

export const toPriceBookItemUpdateDto = (
  values: PriceBookItemForm,
  record: PriceBookItemSummaryDto,
  kind: PriceBookLineKind,
): PriceBookItemUpdateDto => ({
  priceBookId: record.priceBookId,
  inventoryItemId: record.inventoryItemId ?? null,
  displayOrder: record.displayOrder,
  ...toItemFields(values, kind),
});
