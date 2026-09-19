import { z } from 'zod';
import type {
  TaxCreateDto,
  TaxSummaryDto,
  TaxUpdateDto,
} from '@cms/settings-contract';

export const taxFormSchema = z.object({
  taxCode: z.string().trim().min(1, 'Tax Code is required').max(32),
  name: z.string().trim().max(100),
  county: z.string().trim().max(100),
  regionCode: z.string().trim().min(1, 'State is required').max(2),
  city: z.string().trim().max(100),
  isActive: z.boolean(),
});

export type TaxForm = z.infer<typeof taxFormSchema>;

export function emptyTaxForm(): TaxForm {
  return {
    taxCode: '',
    name: '',
    county: '',
    regionCode: '',
    city: '',
    isActive: true,
  };
}

export function toTaxFormValues(tax: TaxSummaryDto): TaxForm {
  return {
    taxCode: tax.taxCode ?? '',
    name: tax.name ?? '',
    county: tax.county ?? '',
    regionCode: tax.regionCode ?? '',
    city: tax.city ?? '',
    isActive: tax.isActive,
  };
}

export function toTaxWriteDto(
  values: TaxForm,
  current?: TaxSummaryDto | null,
): TaxCreateDto & TaxUpdateDto {
  return {
    taxCode: values.taxCode,
    name: values.name === '' ? null : values.name,
    isExternalSystemRecord: false,
    externalSystemId: null,
    syncToken: null,
    showTaxDetail: current?.showTaxDetail ?? true,
    description: current?.description ?? null,
    regionCode: values.regionCode,
    county: values.county === '' ? null : values.county,
    city: values.city === '' ? null : values.city,
  };
}
