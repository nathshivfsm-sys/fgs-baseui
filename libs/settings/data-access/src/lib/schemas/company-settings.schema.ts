import { z } from 'zod';

export const ptoSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'PTO code is required').max(10),
  label: z.string().min(1, 'Label is required'),
  annualAllowance: z.number().positive('Must be greater than 0'),
});

export const taxCodeSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Tax code required').max(10),
  description: z.string().optional(),
  rate: z.number().min(0).max(100, 'Rate must be 0-100'),
});

export const businessUnitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'BU name required'),
  code: z.string().min(1, 'BU code required').max(10),
  active: z.boolean(),
});

export const companySettingsSchema = z.object({
  companyId: z.string(),
  companyName: z.string().min(1, 'Company name required'),
  contactEmail: z.email('Valid email required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  ptos: z.array(ptoSchema),
  taxCodes: z.array(taxCodeSchema),
  businessUnits: z.array(businessUnitSchema),
});

export type CompanySettings = z.infer<typeof companySettingsSchema>;
export type Pto = z.infer<typeof ptoSchema>;
export type TaxCode = z.infer<typeof taxCodeSchema>;
export type BusinessUnit = z.infer<typeof businessUnitSchema>;

export function emptyPto(): Pto {
  return { code: '', label: '', annualAllowance: 1 };
}

export function emptyTaxCode(): TaxCode {
  return { code: '', description: '', rate: 0 };
}

export function emptyBusinessUnit(): BusinessUnit {
  return { name: '', code: '', active: true };
}
