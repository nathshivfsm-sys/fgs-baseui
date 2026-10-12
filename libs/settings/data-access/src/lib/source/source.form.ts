import { z } from 'zod';
import type {
  SourceCreateDto,
  SourceDetailDto,
  SourceSummaryDto,
  SourceUpdateDto,
} from '@cms/settings-contract';

export const sourceFormSchema = z.object({
  sourceName: z
    .string()
    .trim()
    .min(1, 'Source name is required')
    .max(100, 'Source name must be at most 100 characters'),
  description: z
    .string()
    .trim()
    .max(250, 'Description must be at most 250 characters'),
  isActive: z.boolean(),
});

export type SourceForm = z.infer<typeof sourceFormSchema>;

export function emptySourceForm(): SourceForm {
  return { sourceName: '', description: '', isActive: true };
}

export function toSourceFormValues(source: SourceSummaryDto): SourceForm {
  return {
    sourceName: source.sourceName ?? '',
    description: source.description ?? '',
    isActive: source.isActive,
  };
}

function deriveSourceCode(sourceName: string): string {
  const code = sourceName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  return (code || 'SOURCE').slice(0, 32);
}

export function toSourceCreateDto(values: SourceForm): SourceCreateDto {
  return {
    sourceCode: deriveSourceCode(values.sourceName),
    sourceName: values.sourceName,
    description: values.description === '' ? null : values.description,
  };
}

export function toSourceUpdateDto(
  values: SourceForm,
  record: SourceDetailDto | SourceSummaryDto,
): SourceUpdateDto {
  return {
    sourceCode: record.sourceCode ?? deriveSourceCode(values.sourceName),
    sourceName: values.sourceName,
    description: values.description === '' ? null : values.description,
  };
}
