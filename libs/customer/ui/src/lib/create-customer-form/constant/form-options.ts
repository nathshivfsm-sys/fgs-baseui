import type { SelectOption } from '@cms/ui';
import { customerTypeSchema } from '@cms/customer-contract';
import type { z } from 'zod';

export type CustomerTypeOption = z.infer<typeof customerTypeSchema>;

export const CUSTOMER_TYPE_OPTIONS: SelectOption[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'propertyManagement', label: 'Property management' },
  { value: 'builder', label: 'Builder' },
  { value: 'hoa', label: 'HOA' },
  { value: 'other', label: 'Other' },
];

export const isCustomerType = (value: string): value is CustomerTypeOption =>
  CUSTOMER_TYPE_OPTIONS.some((option) => option.value === value);
