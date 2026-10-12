import { z } from 'zod';
import type {
  SalesPipelineStatusCreateDto,
  SalesPipelineStatusDetailDto,
  SalesPipelineStatusSummaryDto,
  SalesPipelineStatusUpdateDto,
} from '@cms/settings-contract';

export const salesPipelineStatusFormSchema = z
  .object({
    statusCode: z.string().trim().min(1, 'Status code is required'),
    statusName: z
      .string()
      .trim()
      .min(1, 'Status name is required')
      .max(100, 'Status name must be at most 100 characters'),
    description: z
      .string()
      .trim()
      .max(500, 'Description must be at most 500 characters'),
    appliesToLead: z.boolean(),
    appliesToOpportunity: z.boolean(),
    isTerminal: z.boolean(),
    allowManualSelection: z.boolean(),
    isActive: z.boolean(),
  })
  .refine((values) => values.appliesToLead || values.appliesToOpportunity, {
    message: 'Select at least one of Lead or Opportunity',
    path: ['appliesToLead'],
  });

export type SalesPipelineStatusForm = z.infer<
  typeof salesPipelineStatusFormSchema
>;

export function emptySalesPipelineStatusForm(): SalesPipelineStatusForm {
  return {
    statusCode: '',
    statusName: '',
    description: '',
    appliesToLead: true,
    appliesToOpportunity: true,
    isTerminal: false,
    allowManualSelection: true,
    isActive: true,
  };
}

export function toSalesPipelineStatusFormValues(
  record: SalesPipelineStatusSummaryDto,
): SalesPipelineStatusForm {
  return {
    statusCode: record.statusCode ?? '',
    statusName: record.statusName ?? '',
    description: record.description ?? '',
    appliesToLead: record.appliesToLead,
    appliesToOpportunity: record.appliesToOpportunity,
    isTerminal: record.isTerminal,
    allowManualSelection: record.allowManualSelection,
    isActive: record.isActive,
  };
}

export function toSalesPipelineStatusCreateDto(
  values: SalesPipelineStatusForm,
): SalesPipelineStatusCreateDto {
  return {
    statusCode: values.statusCode,
    statusName: values.statusName,
    description: values.description === '' ? null : values.description,
    isSystem: false,
    appliesToLead: values.appliesToLead,
    appliesToOpportunity: values.appliesToOpportunity,
    isTerminal: values.isTerminal,
    allowManualSelection: values.allowManualSelection,
    displayOrder: null,
  };
}

export function toSalesPipelineStatusUpdateDto(
  values: SalesPipelineStatusForm,
  record: SalesPipelineStatusDetailDto | SalesPipelineStatusSummaryDto,
): SalesPipelineStatusUpdateDto {
  return {
    statusCode: values.statusCode,
    statusName: values.statusName,
    description: values.description === '' ? null : values.description,
    displayOrder: record.displayOrder,
    isSystem: record.isSystem,
    appliesToLead: values.appliesToLead,
    appliesToOpportunity: values.appliesToOpportunity,
    isTerminal: values.isTerminal,
    allowManualSelection: values.allowManualSelection,
  };
}
