import { z } from 'zod';
import type {
  JobTypeCreateDto,
  JobTypeDetailDto,
  JobTypePatchDto,
  JobTypeSubCategoryDto,
} from '@cms/settings-contract';

/**
 * Swagger publishes `usedFor` as an int32 with no enum. These labels match
 * the Job Type screen (Preventive, Corrective, New Install).
 */
export const JOB_TYPE_USED_FOR_OPTIONS = [
  { value: '1', label: 'Preventive' },
  { value: '2', label: 'Corrective' },
  { value: '3', label: 'New Install' },
] as const;

export const usedForLabel = (usedFor: number): string =>
  JOB_TYPE_USED_FOR_OPTIONS.find((option) => option.value === String(usedFor))
    ?.label ?? String(usedFor);

export const jobTypeFormSchema = z.object({
  name: z.string().trim().min(1, 'Job type is required').max(100),
  categoryId: z.string().trim().min(1, 'Category is required'),
  subcategoryId: z.string().trim().min(1, 'Sub-category is required'),
  businessUnit: z.string(),
  usedFor: z.string().trim().min(1, 'Used for is required'),
  showToFieldTech: z.boolean(),
  showOnCustomerPortal: z.boolean(),
  isActive: z.boolean(),
});

export type JobTypeForm = z.infer<typeof jobTypeFormSchema>;

export const emptyJobTypeForm = (): JobTypeForm => ({
  name: '',
  categoryId: '',
  subcategoryId: '',
  businessUnit: '',
  usedFor: '',
  showToFieldTech: true,
  showOnCustomerPortal: true,
  isActive: true,
});

export const toJobTypeFormValues = (record: JobTypeDetailDto): JobTypeForm => {
  const primary = record.subCategories?.[0];
  return {
    name: record.name ?? '',
    categoryId: primary ? String(primary.categoryId) : '',
    subcategoryId: primary ? String(primary.jobTypeTaskId) : '',
    businessUnit: record.businessUnit ?? '',
    usedFor: String(record.usedFor),
    showToFieldTech: record.showToFieldTech,
    showOnCustomerPortal: record.showOnCustomerPortal,
    isActive: record.isActive,
  };
};

const toSubCategoryWrites = (jobTypeTaskIds: readonly number[]) =>
  jobTypeTaskIds.map((jobTypeTaskId, index) => ({
    jobTypeTaskId,
    displayOrder: index + 1,
    isActive: true,
  }));

export const toJobTypeCreateDto = (values: JobTypeForm): JobTypeCreateDto => ({
  jobTypeCode: 'A',
  name: values.name,
  usedFor: Number(values.usedFor),
  businessUnit: values.businessUnit.trim() || null,
  showToFieldTech: values.showToFieldTech,
  showOnCustomerPortal: values.showOnCustomerPortal,
  displayOrder: 0,
  subCategories: toSubCategoryWrites([Number(values.subcategoryId)]),
  isActive: values.isActive,
});

export const toJobTypePatchDto = (
  values: JobTypeForm,
  current: JobTypeDetailDto,
): JobTypePatchDto => {
  const selectedId = Number(values.subcategoryId);
  const existingIds = (current.subCategories ?? []).map(
    (row: JobTypeSubCategoryDto) => row.jobTypeTaskId,
  );
  const primaryId = existingIds[0];
  const nextIds =
    primaryId === selectedId
      ? existingIds
      : [
          selectedId,
          ...existingIds.filter(
            (id: number) => id !== selectedId && id !== primaryId,
          ),
        ];

  return {
    jobTypeCode: current.jobTypeCode,
    name: values.name,
    usedFor: Number(values.usedFor),
    businessUnit: values.businessUnit.trim() || null,
    showToFieldTech: values.showToFieldTech,
    showOnCustomerPortal: values.showOnCustomerPortal,
    displayOrder: current.displayOrder,
    isActive: values.isActive,
    subCategories: toSubCategoryWrites(nextIds),
  };
};
