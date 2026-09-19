import { z } from 'zod';
import type {
  TaxAuthorityCreateDto,
  TaxAuthoritySummaryDto,
  TaxAuthorityUpdateDto,
} from '@cms/settings-contract';

export const taxAuthorityFormSchema = z.object({
  name: z.string().trim().min(1, 'Tax Authority is required').max(100),
  taxPercent: z
    .string()
    .trim()
    .min(1, 'Rate is required')
    .refine(
      (value) => Number.isFinite(Number(value)),
      'Enter a valid rate',
    ),
  isActive: z.boolean(),
  effectiveFromDate: z
    .string()
    .trim()
    .min(1, 'Effective Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
});

export type TaxAuthorityForm = z.infer<typeof taxAuthorityFormSchema>;

export function emptyTaxAuthorityForm(): TaxAuthorityForm {
  return { name: '', taxPercent: '', isActive: true, effectiveFromDate: '' };
}

export function toTaxAuthorityFormValues(
  authority: TaxAuthoritySummaryDto,
): TaxAuthorityForm {
  return {
    name: authority.name ?? '',
    taxPercent: String(authority.taxPercent),
    isActive: authority.isActive,
    effectiveFromDate: authority.effectiveFromDate ?? '',
  };
}

function toAuthorityCode(name: string): string {
  const slug = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return (slug || 'TAX').slice(0, 32);
}

export function toTaxAuthorityWriteDto(
  values: TaxAuthorityForm,
  current?: TaxAuthoritySummaryDto | null,
): TaxAuthorityCreateDto & TaxAuthorityUpdateDto {
  return {
    code: current?.code ?? toAuthorityCode(values.name),
    name: values.name,
    regionCode: current?.regionCode ?? null,
    isExternalSystemRecord: current?.isExternalSystemRecord ?? false,
    taxPercent: Number(values.taxPercent),
    description: current?.description ?? null,
    effectiveFromDate: values.effectiveFromDate,
  };
}
