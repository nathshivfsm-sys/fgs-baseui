import { z } from 'zod';
import type {
  GlBreakCreateDto,
  GlBreakLocationWriteDto,
  GlBreakSummaryDto,
  GlBreakUpdateDto,
} from '@cms/settings-contract';

export const glBreakFormSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(32),
  name: z.string().trim().min(1, 'Name is required').max(100),
  breakLabel: z.string().trim().max(100),
  addressLine1: z.string().trim().max(120),
  addressLine2: z.string().trim().max(120),
  city: z.string().trim().max(80),
  state: z.string().trim().max(40),
  postalCode: z.string().trim().max(20),
});

export type GlBreakForm = z.infer<typeof glBreakFormSchema>;

export const emptyGlBreakForm = (): GlBreakForm => ({
  code: '',
  name: '',
  breakLabel: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
});

export const toGlBreakFormValues = (record: GlBreakSummaryDto): GlBreakForm => ({
  code: record.code ?? '',
  name: record.name ?? '',
  breakLabel: record.breakLabel ?? '',
  addressLine1: record.address?.addressLine1 ?? '',
  addressLine2: record.address?.addressLine2 ?? '',
  city: record.address?.city ?? '',
  state: record.address?.state ?? '',
  postalCode: record.address?.postalCode ?? '',
});

const toNullable = (value: string): string | null =>
  value === '' ? null : value;

const toWriteAddress = (
  values: GlBreakForm,
): GlBreakLocationWriteDto | null => {
  const addressLine1 = toNullable(values.addressLine1);
  const addressLine2 = toNullable(values.addressLine2);
  const city = toNullable(values.city);
  const state = toNullable(values.state);
  const postalCode = toNullable(values.postalCode);
  if (!addressLine1 && !addressLine2 && !city && !state && !postalCode) {
    return null;
  }
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
    country: null,
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
  tradeCodes: null,
});
