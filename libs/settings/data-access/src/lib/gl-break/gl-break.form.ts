import { z } from 'zod';
import type {
  GlBreakCreateDto,
  GlBreakDetailDto,
  GlBreakLocationWriteDto,
  GlBreakSummaryDto,
  GlBreakUpdateDto,
} from '@cms/settings-contract';

export const glBreakFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  code: z.string().trim().min(1, 'Code is required').max(32),
  tradeCodes: z.array(z.string()),
  breakLabel: z.string().trim().max(100),
  addressLine1: z
    .string()
    .trim()
    .min(1, 'Address line 1 is required')
    .max(120),
  addressLine2: z.string().trim().max(120),
  postalCode: z
    .string()
    .trim()
    .min(1, 'Zip/Postal code is required')
    .max(20),
  city: z.string().trim().min(1, 'City is required').max(80),
  state: z.string().trim().min(1, 'State is required').max(40),
  country: z.string().trim().min(1, 'Country is required').max(40),
  isActive: z.boolean(),
});

export type GlBreakForm = z.infer<typeof glBreakFormSchema>;

export const emptyGlBreakForm = (): GlBreakForm => ({
  name: '',
  code: '',
  tradeCodes: [],
  breakLabel: '',
  addressLine1: '',
  addressLine2: '',
  postalCode: '',
  city: '',
  state: 'IL',
  country: 'US',
  isActive: true,
});

const tradeCodesFromRecord = (
  record: GlBreakSummaryDto | GlBreakDetailDto,
): string[] => {
  if (!('trades' in record) || !record.trades) {
    return [];
  }
  return record.trades
    .map((trade) => trade.tradeCode)
    .filter((code): code is string => Boolean(code));
};

export const toGlBreakFormValues = (
  record: GlBreakSummaryDto | GlBreakDetailDto,
): GlBreakForm => ({
  name: record.name ?? '',
  code: record.code ?? '',
  tradeCodes: tradeCodesFromRecord(record),
  breakLabel: record.breakLabel ?? '',
  addressLine1: record.address?.addressLine1 ?? '',
  addressLine2: record.address?.addressLine2 ?? '',
  postalCode: record.address?.postalCode ?? '',
  city: record.address?.city ?? '',
  state: record.address?.state || 'IL',
  country: record.address?.country || 'US',
  isActive: record.isActive,
});

const toNullable = (value: string): string | null =>
  value === '' ? null : value;

const toWriteAddress = (values: GlBreakForm): GlBreakLocationWriteDto => {
  const addressLine1 = toNullable(values.addressLine1);
  const addressLine2 = toNullable(values.addressLine2);
  const city = toNullable(values.city);
  const state = toNullable(values.state);
  const country = toNullable(values.country);
  const postalCode = toNullable(values.postalCode);
  const street = [addressLine1, addressLine2].filter(Boolean).join(', ');
  const locality = [city, [state, postalCode].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(', ');
  return {
    addressLine1,
    addressLine2,
    addressLine3: null,
    addressLine4: null,
    city,
    state,
    county: null,
    country,
    postalCode,
    formattedAddress: [street, locality].filter(Boolean).join(', ') || null,
    latitude: null,
    longitude: null,
    placeId: null,
  };
};

export const toGlBreakWriteDto = (
  values: GlBreakForm,
  breakLevel: number,
): GlBreakCreateDto & GlBreakUpdateDto => ({
  code: values.code,
  name: values.name,
  breakLabel: toNullable(values.breakLabel),
  breakLevel,
  logoFileId: null,
  address: toWriteAddress(values),
  tradeCodes: values.tradeCodes.length > 0 ? values.tradeCodes : null,
});
