import { z } from 'zod';
import type {
  PriceBookCreateDto,
  PriceBookDetailDto,
} from '@cms/settings-contract';

/** Stored on `pricingModel`. Existing rows may still say FLAT or HOURLY. */
export const PRICE_BOOK_PRICING_STATIC = 'Static';
export const PRICE_BOOK_PRICING_DYNAMIC = 'Dynamic';

export const PRICE_BOOK_COMPONENT_PRICE_FIELDS = [
  'equipmentPrice',
  'materialPrice',
  'laborPrice',
  'afterHourPrice',
  'otherPrice',
] as const;

const MONEY = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/;
const HOURS = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/;

const moneyField = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || MONEY.test(value), {
      message: `Enter ${label} as a number, 0 or greater, with up to 2 decimal places.`,
    });

/**
 * Screen schema for the price book editor.
 * Membership, labor tax, and the five amount boxes are collected here.
 * Only the fields on `PriceBookCreateDto` are sent. The five amounts become
 * one `basePrice` when the user changes any of them.
 */
export const priceBookFormSchema = z.object({
  priceBookCode: z
    .string()
    .trim()
    .min(1, 'Code is required.')
    .max(50, 'Code must be at most 50 characters.'),
  priceBookName: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(100, 'Name must be at most 100 characters.'),
  jobTypeId: z.string().trim().min(1, 'Job type is required.'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be at most 500 characters.'),
  isTaxable: z.boolean(),
  estimatedHours: z
    .string()
    .trim()
    .refine((value) => HOURS.test(value), {
      message: 'Enter estimated hours as a number, 0 or greater.',
    }),
  pricingModel: z.union([
    z.literal(PRICE_BOOK_PRICING_STATIC),
    z.literal(PRICE_BOOK_PRICING_DYNAMIC),
  ]),
  equipmentPrice: moneyField('the equipment price'),
  materialPrice: moneyField('the material price'),
  laborPrice: moneyField('the labor price'),
  afterHourPrice: moneyField('the after-hour price'),
  otherPrice: moneyField('the other price'),
  laborTaxable: z.boolean(),
  membershipType: z.string(),
  membershipDiscountPercent: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || (MONEY.test(value) && Number(value) <= 100),
      { message: 'Enter a discount from 0 to 100.' },
    ),
  discountAccount: z.string(),
});

export type PriceBookForm = z.infer<typeof priceBookFormSchema>;

export type PriceBookComponentPriceField =
  (typeof PRICE_BOOK_COMPONENT_PRICE_FIELDS)[number];

export const emptyPriceBookForm = (): PriceBookForm => ({
  priceBookCode: '',
  priceBookName: '',
  jobTypeId: '',
  description: '',
  isTaxable: false,
  estimatedHours: '',
  pricingModel: PRICE_BOOK_PRICING_STATIC,
  equipmentPrice: '0',
  materialPrice: '0',
  laborPrice: '0',
  afterHourPrice: '0',
  otherPrice: '0',
  laborTaxable: false,
  membershipType: '',
  membershipDiscountPercent: '',
  discountAccount: '',
});

export const toPricingModel = (
  value: string | null | undefined,
): PriceBookForm['pricingModel'] => {
  const normalized = (value ?? '').trim().toLowerCase();
  if (normalized === 'dynamic' || normalized === 'hourly') {
    return PRICE_BOOK_PRICING_DYNAMIC;
  }
  return PRICE_BOOK_PRICING_STATIC;
};

const hoursFromMinutes = (minutes: number) => {
  const hours = minutes / 60;
  const rounded = Math.round(hours * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
};

export const toPriceBookFormValues = (
  record: PriceBookDetailDto,
): PriceBookForm => ({
  ...emptyPriceBookForm(),
  priceBookCode: record.priceBookCode ?? '',
  priceBookName: record.priceBookName ?? '',
  jobTypeId: String(record.jobTypeId),
  description: record.description ?? '',
  isTaxable: record.isTaxable,
  estimatedHours: hoursFromMinutes(record.estimatedDurationMinutes),
  pricingModel: toPricingModel(record.pricingModel),
});

const parseMoney = (value: string) => (value.trim() === '' ? 0 : Number(value));

export const sumComponentPrices = (values: PriceBookForm) => {
  const total = PRICE_BOOK_COMPONENT_PRICE_FIELDS.reduce(
    (sum, field) => sum + parseMoney(values[field]),
    0,
  );
  return Math.round(total * 100) / 100;
};

export const componentPricesAreDirty = (
  dirty: Partial<Record<string, unknown>>,
) => PRICE_BOOK_COMPONENT_PRICE_FIELDS.some((field) => Boolean(dirty[field]));

export interface PriceBookWriteOptions {
  /** Undefined on create. Null when the saved service has no price. */
  savedBasePrice?: number | null;
  componentPricesDirty: boolean;
}

/**
 * Keeps the saved price until the user edits an amount. Editing any amount
 * replaces `basePrice` with the sum of the five fields.
 */
export const resolveBasePrice = (
  values: PriceBookForm,
  options: PriceBookWriteOptions,
): number | null => {
  if (!options.componentPricesDirty && options.savedBasePrice !== undefined) {
    return options.savedBasePrice;
  }
  return sumComponentPrices(values);
};

export const toPriceBookWriteDto = (
  values: PriceBookForm,
  options: PriceBookWriteOptions,
): PriceBookCreateDto => ({
  priceBookCode: values.priceBookCode,
  priceBookName: values.priceBookName,
  description: values.description ? values.description : null,
  jobTypeId: Number(values.jobTypeId),
  pricingModel: values.pricingModel,
  estimatedDurationMinutes: Math.round(Number(values.estimatedHours) * 60),
  basePrice: resolveBasePrice(values, options),
  isTaxable: values.isTaxable,
});
