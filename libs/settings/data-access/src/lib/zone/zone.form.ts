import { z } from 'zod';
import type {
  ZoneCreateDto,
  ZoneSummaryDto,
  ZoneUpdateDto,
} from '@cms/settings-contract';

export const zoneFormSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(32),
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().max(250),
});

export type ZoneForm = z.infer<typeof zoneFormSchema>;

export function emptyZoneForm(): ZoneForm {
  return { code: '', name: '', description: '' };
}

export function toZoneFormValues(zone: ZoneSummaryDto): ZoneForm {
  return {
    code: zone.code ?? '',
    name: zone.name ?? '',
    description: zone.description ?? '',
  };
}

export function toZoneWriteDto(values: ZoneForm): ZoneCreateDto & ZoneUpdateDto {
  return {
    code: values.code,
    name: values.name,
    description: values.description === '' ? null : values.description,
  };
}
