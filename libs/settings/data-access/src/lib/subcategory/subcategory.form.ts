import { z } from 'zod';
import type {
  SubcategoryCreateDto,
  SubcategoryPatchDto,
  SubcategorySummaryDto,
} from '@cms/settings-contract';

const hoursText = z
  .string()
  .trim()
  .min(1, 'Estimated time is required')
  .refine((value) => {
    const hours = Number(value);
    return Number.isFinite(hours) && hours >= 0;
  }, 'Enter estimated time in hours');

export const subcategoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  tradeId: z.string().trim().min(1, 'Trade is required'),
  skillLevelId: z.string(),
  taskName: z.string().trim().max(100),
  estimatedHours: hoursText,
  priority: z.string().trim().min(1, 'Priority is required'),
  isActive: z.boolean(),
});

export type SubcategoryForm = z.infer<typeof subcategoryFormSchema>;

export const emptySubcategoryForm = (): SubcategoryForm => ({
  name: '',
  tradeId: '',
  skillLevelId: '',
  taskName: '',
  estimatedHours: '',
  priority: '',
  isActive: true,
});

export const toSubcategoryFormValues = (
  record: SubcategorySummaryDto,
): SubcategoryForm => ({
  name: record.name ?? '',
  tradeId: String(record.tradeId),
  skillLevelId: record.skillLevelId == null ? '' : String(record.skillLevelId),
  taskName: record.taskName ?? '',
  estimatedHours: String(record.estimatedHours),
  priority: ['1', '2', '3'].includes(String(record.priority))
    ? String(record.priority)
    : '',
  isActive: record.isActive,
});

const toWriteNumbers = (values: SubcategoryForm) => ({
  tradeId: Number(values.tradeId),
  name: values.name,
  priority: Number(values.priority),
  estimatedHours: Number(values.estimatedHours),
  taskName: values.taskName === '' ? null : values.taskName,
  skillLevelId: values.skillLevelId === '' ? null : Number(values.skillLevelId),
});

export const toSubcategoryCreateDto = (
  jobCategoryId: number,
  values: SubcategoryForm,
): SubcategoryCreateDto => ({
  jobCategoryId,
  ...toWriteNumbers(values),
  displayOrder: null,
  isActive: values.isActive,
});

export const toSubcategoryPatchDto = (
  values: SubcategoryForm,
): SubcategoryPatchDto => ({
  ...toWriteNumbers(values),
  isActive: values.isActive,
});
