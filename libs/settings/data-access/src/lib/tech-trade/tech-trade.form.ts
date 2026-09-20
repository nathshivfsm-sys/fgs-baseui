import { z } from 'zod';
import type {
  TechTradeCreateDto,
  TechTradeSummaryDto,
  TechTradeUpdateDto,
} from '@cms/settings-contract';

export const techTradeFormSchema = z.object({
  tradeCode: z.string().trim().min(1, 'Trade code is required').max(32),
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().max(250),
  skillIds: z.array(z.string()),
});

export type TechTradeForm = z.infer<typeof techTradeFormSchema>;

export const emptyTechTradeForm = (): TechTradeForm => ({
  tradeCode: '',
  name: '',
  description: '',
  skillIds: [],
});

export const toTechTradeFormValues = (
  trade: TechTradeSummaryDto,
): TechTradeForm => ({
  tradeCode: trade.tradeCode ?? '',
  name: trade.name ?? '',
  description: trade.description ?? '',
  skillIds: (trade.skillIds ?? []).map(String),
});

export const toTechTradeWriteDto = (
  values: TechTradeForm,
): TechTradeCreateDto & TechTradeUpdateDto => ({
  tradeCode: values.tradeCode,
  name: values.name,
  description: values.description === '' ? null : values.description,
  skillIds: values.skillIds.map(Number),
});
