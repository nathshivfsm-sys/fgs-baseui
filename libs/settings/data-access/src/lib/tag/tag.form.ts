import { z } from 'zod';
import type {
  TagCreateDto,
  TagDetailDto,
  TagSummaryDto,
  TagUpdateDto,
} from '@cms/settings-contract';

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export const tagFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tag name is required')
    .max(100, 'Tag name must be at most 100 characters'),
  entity: z.string(),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be at most 500 characters'),
  backgroundColor: z
    .string()
    .trim()
    .regex(HEX_COLOR, 'Enter a valid background color'),
  textColor: z.string().trim().regex(HEX_COLOR, 'Enter a valid text color'),
  isActive: z.boolean(),
});

export type TagForm = z.infer<typeof tagFormSchema>;

export function emptyTagForm(): TagForm {
  return {
    name: '',
    entity: '',
    description: '',
    backgroundColor: '#D9D9D9',
    textColor: '#374151',
    isActive: true,
  };
}

function deriveTagCode(name: string): string {
  const code = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  return (code || 'TAG').slice(0, 32);
}

function toEntityList(entity: string): string[] | null {
  const trimmed = entity.trim();
  return trimmed === '' ? null : [trimmed];
}

export function toTagFormValues(record: TagSummaryDto): TagForm {
  const entity = record.entities?.[0] ?? '';
  return {
    name: record.name ?? '',
    entity,
    description: record.description ?? '',
    backgroundColor: record.backgroundColor ?? '#D9D9D9',
    textColor: record.textColor ?? '#374151',
    isActive: record.isActive,
  };
}

export function toTagCreateDto(values: TagForm): TagCreateDto {
  return {
    tagCode: deriveTagCode(values.name),
    name: values.name,
    description: values.description === '' ? null : values.description,
    backgroundColor: values.backgroundColor,
    textColor: values.textColor,
    iconFileId: null,
    entities: toEntityList(values.entity),
  };
}

export function toTagUpdateDto(
  values: TagForm,
  record: TagDetailDto | TagSummaryDto,
): TagUpdateDto {
  return {
    tagCode: record.tagCode ?? deriveTagCode(values.name),
    name: values.name,
    description: values.description === '' ? null : values.description,
    backgroundColor: values.backgroundColor,
    textColor: values.textColor,
    iconFileId: record.iconFileId ?? null,
    entities: toEntityList(values.entity),
  };
}
