import { z } from 'zod';
import type {
  SalesActivityTypeCreateDto,
  SalesActivityTypeDetailDto,
  SalesActivityTypeSummaryDto,
  SalesActivityTypeUpdateDto,
} from '@cms/settings-contract';

export const salesActivityTypeFormSchema = z
  .object({
    activityTypeCode: z.string().trim().min(1, 'Activity code is required'),
    activityTypeName: z
      .string()
      .trim()
      .min(1, 'Activity name is required')
      .max(100, 'Activity name must be at most 100 characters'),
    description: z
      .string()
      .trim()
      .max(500, 'Description must be at most 500 characters'),
    appliesToLead: z.boolean(),
    appliesToOpportunity: z.boolean(),
    allowManualSelection: z.boolean(),
    isActive: z.boolean(),
  })
  .refine((values) => values.appliesToLead || values.appliesToOpportunity, {
    message: 'Select at least one of Lead or Opportunity',
    path: ['appliesToLead'],
  });

export type SalesActivityTypeForm = z.infer<typeof salesActivityTypeFormSchema>;

export function emptySalesActivityTypeForm(): SalesActivityTypeForm {
  return {
    activityTypeCode: '',
    activityTypeName: '',
    description: '',
    appliesToLead: true,
    appliesToOpportunity: true,
    allowManualSelection: true,
    isActive: true,
  };
}

export function toSalesActivityTypeFormValues(
  record: SalesActivityTypeSummaryDto,
): SalesActivityTypeForm {
  return {
    activityTypeCode: record.activityTypeCode ?? '',
    activityTypeName: record.activityTypeName ?? '',
    description: record.description ?? '',
    appliesToLead: record.appliesToLead,
    appliesToOpportunity: record.appliesToOpportunity,
    allowManualSelection: record.allowManualSelection,
    isActive: record.isActive,
  };
}

export function toSalesActivityTypeCreateDto(
  values: SalesActivityTypeForm,
): SalesActivityTypeCreateDto {
  return {
    activityTypeCode: values.activityTypeCode,
    activityTypeName: values.activityTypeName,
    description: values.description === '' ? null : values.description,
    isSystem: false,
    appliesToLead: values.appliesToLead,
    appliesToOpportunity: values.appliesToOpportunity,
    allowManualSelection: values.allowManualSelection,
    displayOrder: null,
  };
}

export function toSalesActivityTypeUpdateDto(
  values: SalesActivityTypeForm,
  record: SalesActivityTypeDetailDto | SalesActivityTypeSummaryDto,
): SalesActivityTypeUpdateDto {
  return {
    activityTypeCode: values.activityTypeCode,
    activityTypeName: values.activityTypeName,
    description: values.description === '' ? null : values.description,
    displayOrder: record.displayOrder,
    isSystem: record.isSystem,
    appliesToLead: values.appliesToLead,
    appliesToOpportunity: values.appliesToOpportunity,
    allowManualSelection: values.allowManualSelection,
  };
}
