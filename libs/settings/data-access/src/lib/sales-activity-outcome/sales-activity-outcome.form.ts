import { z } from 'zod';
import type {
  SalesActivityOutcomeCreateDto,
  SalesActivityOutcomeDetailDto,
  SalesActivityOutcomeSummaryDto,
  SalesActivityOutcomeUpdateDto,
} from '@cms/settings-contract';

export const salesActivityOutcomeFormSchema = z
  .object({
    outcomeCode: z.string().trim().min(1, 'Outcome code is required'),
    outcomeName: z
      .string()
      .trim()
      .min(1, 'Outcome name is required')
      .max(100, 'Outcome name must be at most 100 characters'),
    description: z
      .string()
      .trim()
      .max(500, 'Description must be at most 500 characters'),
    nextSalesPipelineStatusId: z.string(),
    appliesToLead: z.boolean(),
    appliesToOpportunity: z.boolean(),
    allowManualSelection: z.boolean(),
    isTerminal: z.boolean(),
    requireComment: z.boolean(),
    isActive: z.boolean(),
  })
  .refine((values) => values.appliesToLead || values.appliesToOpportunity, {
    message: 'Select at least one of Lead or Opportunity',
    path: ['appliesToLead'],
  });

export type SalesActivityOutcomeForm = z.infer<
  typeof salesActivityOutcomeFormSchema
>;

export function emptySalesActivityOutcomeForm(): SalesActivityOutcomeForm {
  return {
    outcomeCode: '',
    outcomeName: '',
    description: '',
    nextSalesPipelineStatusId: '',
    appliesToLead: true,
    appliesToOpportunity: true,
    allowManualSelection: true,
    isTerminal: false,
    requireComment: false,
    isActive: true,
  };
}

export function toSalesActivityOutcomeFormValues(
  record: SalesActivityOutcomeSummaryDto,
): SalesActivityOutcomeForm {
  return {
    outcomeCode: record.outcomeCode ?? '',
    outcomeName: record.outcomeName ?? '',
    description: record.description ?? '',
    nextSalesPipelineStatusId:
      record.nextSalesPipelineStatusId == null
        ? ''
        : String(record.nextSalesPipelineStatusId),
    appliesToLead: record.appliesToLead,
    appliesToOpportunity: record.appliesToOpportunity,
    allowManualSelection: record.allowManualSelection,
    isTerminal: record.isTerminal,
    requireComment: record.requireComment,
    isActive: record.isActive,
  };
}

function toNextStatusId(value: string): number | null {
  if (value === '') return null;
  return Number(value);
}

export function toSalesActivityOutcomeCreateDto(
  values: SalesActivityOutcomeForm,
): SalesActivityOutcomeCreateDto {
  return {
    outcomeCode: values.outcomeCode,
    outcomeName: values.outcomeName,
    description: values.description === '' ? null : values.description,
    isSystem: false,
    appliesToLead: values.appliesToLead,
    appliesToOpportunity: values.appliesToOpportunity,
    nextSalesPipelineStatusId: toNextStatusId(values.nextSalesPipelineStatusId),
    isTerminal: values.isTerminal,
    requireComment: values.requireComment,
    allowManualSelection: values.allowManualSelection,
    displayOrder: null,
  };
}

export function toSalesActivityOutcomeUpdateDto(
  values: SalesActivityOutcomeForm,
  record: SalesActivityOutcomeDetailDto | SalesActivityOutcomeSummaryDto,
): SalesActivityOutcomeUpdateDto {
  return {
    outcomeCode: values.outcomeCode,
    outcomeName: values.outcomeName,
    description: values.description === '' ? null : values.description,
    displayOrder: record.displayOrder,
    isSystem: record.isSystem,
    appliesToLead: values.appliesToLead,
    appliesToOpportunity: values.appliesToOpportunity,
    nextSalesPipelineStatusId: toNextStatusId(values.nextSalesPipelineStatusId),
    isTerminal: values.isTerminal,
    requireComment: values.requireComment,
    allowManualSelection: values.allowManualSelection,
  };
}
