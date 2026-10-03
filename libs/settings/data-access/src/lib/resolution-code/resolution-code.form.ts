import { z } from 'zod';
import type {
  ResolutionCodeCreateDto,
  ResolutionCodeSummaryDto,
  ResolutionCodeUpdateDto,
} from '@cms/settings-contract';

export const resolutionCodeFormSchema = z.object({
  resolutionCode: z
    .string()
    .trim()
    .min(1, 'Resolution Code is required')
    .max(50),
  resolutionName: z
    .string()
    .trim()
    .min(1, 'Resolution Name is required')
    .max(100),
  typeId: z.string().trim().min(1, 'Resolution Type is required'),
  isMobileVisible: z.boolean(),
});

export type ResolutionCodeForm = z.infer<typeof resolutionCodeFormSchema>;

export const emptyResolutionCodeForm = (): ResolutionCodeForm => ({
  resolutionCode: '',
  resolutionName: '',
  typeId: '',
  isMobileVisible: true,
});

export const toResolutionCodeFormValues = (
  record: ResolutionCodeSummaryDto,
): ResolutionCodeForm => ({
  resolutionCode: record.resolutionCode ?? '',
  resolutionName: record.resolutionName ?? '',
  typeId: String(record.gloResolutionTypeId),
  isMobileVisible: record.isMobileVisible,
});

export const toResolutionCodeCreateDto = (
  values: ResolutionCodeForm,
): ResolutionCodeCreateDto => ({
  gloResolutionTypeId: Number(values.typeId),
  resolutionCode: values.resolutionCode,
  resolutionName: values.resolutionName,
  isMobileVisible: values.isMobileVisible,
});

export const toResolutionCodeUpdateDto = (
  values: ResolutionCodeForm,
): ResolutionCodeUpdateDto => toResolutionCodeCreateDto(values);
