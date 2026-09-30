import { z } from 'zod';
import type {
  JobCategoryCreateDto,
  JobCategoryPatchDto,
  JobCategorySummaryDto,
} from '@cms/settings-contract';

const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Enter a color like #374151');

export const jobCategoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  backgroundColor: hexColor,
  textColor: hexColor,
  isActive: z.boolean(),
});

export type JobCategoryForm = z.infer<typeof jobCategoryFormSchema>;

export const emptyJobCategoryForm = (): JobCategoryForm => ({
  name: '',
  backgroundColor: '#D9D9D9',
  textColor: '#374151',
  isActive: true,
});

export const toJobCategoryFormValues = (
  category: JobCategorySummaryDto,
): JobCategoryForm => ({
  name: category.name ?? '',
  backgroundColor: category.backgroundColor ?? '#D9D9D9',
  textColor: category.textColor ?? '#374151',
  isActive: category.isActive,
});

export const toJobCategoryCreateDto = (
  values: JobCategoryForm,
): JobCategoryCreateDto => ({
  categoryCode: null,
  name: values.name,
  displayOrder: null,
  backgroundColor: values.backgroundColor,
  textColor: values.textColor,
  isActive: values.isActive,
});

export const toJobCategoryPatchDto = (
  values: JobCategoryForm,
): JobCategoryPatchDto => ({
  name: values.name,
  backgroundColor: values.backgroundColor,
  textColor: values.textColor,
  isActive: values.isActive,
});
