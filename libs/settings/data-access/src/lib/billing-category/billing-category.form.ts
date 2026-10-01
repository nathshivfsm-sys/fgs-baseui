import { z } from 'zod';
import type {
  BillingCategoryCreateDto,
  BillingCategorySummaryDto,
  BillingCategoryUpdateDto,
} from '@cms/settings-contract';

export const billingCategoryFormSchema = z.object({
  billingCategoryType: z
    .string()
    .trim()
    .min(1, 'Billing Category Type is required'),
  billingCategoryName: z
    .string()
    .trim()
    .min(1, 'Billing Category Name is required')
    .max(100, 'Billing Category Name must be at most 100 characters'),
  description: z
    .string()
    .trim()
    .max(700, 'Description must be at most 700 characters'),
  showToFieldTech: z.boolean(),
  allowToPick: z.boolean(),
});

export type BillingCategoryForm = z.infer<typeof billingCategoryFormSchema>;

export const emptyBillingCategoryForm = (): BillingCategoryForm => ({
  billingCategoryType: '',
  billingCategoryName: '',
  description: '',
  showToFieldTech: true,
  allowToPick: true,
});

export const toBillingCategoryCreateDto = (
  values: BillingCategoryForm,
): BillingCategoryCreateDto => ({
  billingCategoryType: values.billingCategoryType,
  billingCategoryName: values.billingCategoryName,
  description: values.description === '' ? null : values.description,
  displayOrder: null,
  isSystemDefined: false,
  showToFieldTech: values.showToFieldTech,
  allowToPick: values.allowToPick,
});

export const toBillingCategoryFormValues = (
  record: BillingCategorySummaryDto,
): BillingCategoryForm => ({
  billingCategoryType: record.billingCategoryType ?? '',
  billingCategoryName: record.billingCategoryName ?? '',
  description: record.description ?? '',
  showToFieldTech: record.showToFieldTech,
  allowToPick: record.allowToPick,
});

export const toBillingCategoryUpdateDto = (
  values: BillingCategoryForm,
  record: BillingCategorySummaryDto,
): BillingCategoryUpdateDto => ({
  billingCategoryType: values.billingCategoryType,
  billingCategoryName: values.billingCategoryName,
  description: values.description === '' ? null : values.description,
  displayOrder: record.displayOrder ?? null,
  isSystemDefined: record.isSystemDefined,
  showToFieldTech: values.showToFieldTech,
  allowToPick: values.allowToPick,
});
