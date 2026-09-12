import { z } from 'zod';
import type {
  NonWorkingDateCreateDto,
  NonWorkingDateSummaryDto,
  NonWorkingDateUpdateDto,
} from '@cms/settings-contract';

export const nonWorkingDateFormSchema = z.object({
  nonWorkingDate: z
    .string()
    .trim()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
  name: z.string().trim().min(1, 'Description is required').max(100),
});

export type NonWorkingDateForm = z.infer<typeof nonWorkingDateFormSchema>;

export function emptyNonWorkingDateForm(): NonWorkingDateForm {
  return { nonWorkingDate: '', name: '' };
}

export function toNonWorkingDateFormValues(
  row: NonWorkingDateSummaryDto,
): NonWorkingDateForm {
  return {
    nonWorkingDate: row.nonWorkingDate,
    name: row.name ?? '',
  };
}

export function toNonWorkingDateWriteDto(
  values: NonWorkingDateForm,
): NonWorkingDateCreateDto & NonWorkingDateUpdateDto {
  return {
    nonWorkingDate: values.nonWorkingDate,
    name: values.name,
  };
}
