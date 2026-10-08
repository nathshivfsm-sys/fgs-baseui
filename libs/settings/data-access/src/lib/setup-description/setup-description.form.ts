import { z } from 'zod';
import type {
  SetupDescriptionCreateDto,
  SetupDescriptionSummaryDto,
  SetupDescriptionUpdateDto,
} from '@cms/settings-contract';

export const setupDescriptionFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  body: z.string().trim().min(1, 'Description is required'),
  tradeId: z.string(),
});

export type SetupDescriptionForm = z.infer<typeof setupDescriptionFormSchema>;

export const emptySetupDescriptionForm = (): SetupDescriptionForm => ({
  title: '',
  body: '',
  tradeId: '',
});

export const toSetupDescriptionFormValues = (
  record: SetupDescriptionSummaryDto,
): SetupDescriptionForm => ({
  title: record.shortNote ?? '',
  body: record.body ?? '',
  tradeId:
    record.fgsSetupTechTradeId != null
      ? String(record.fgsSetupTechTradeId)
      : '',
});

const parseTradeId = (tradeId: string) => {
  const trimmed = tradeId.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

export const toSetupDescriptionCreateDto = (
  values: SetupDescriptionForm,
  descriptionTypeCode: string,
  sortOrder: number,
): SetupDescriptionCreateDto => ({
  descriptionTypeCode,
  shortNote: values.title,
  body: values.body,
  fgsSetupTechTradeId: parseTradeId(values.tradeId),
  sortOrder,
});

export const toSetupDescriptionUpdateDto = (
  values: SetupDescriptionForm,
  record: SetupDescriptionSummaryDto,
): SetupDescriptionUpdateDto => ({
  descriptionTypeCode: record.descriptionTypeCode ?? undefined,
  shortNote: values.title,
  body: values.body,
  fgsSetupTechTradeId: parseTradeId(values.tradeId),
  sortOrder: record.sortOrder,
});
