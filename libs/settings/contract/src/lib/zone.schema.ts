import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/zone` from the FGS Setup Service swagger (`FgsSetupZone*` DTOs).
 */
export const zoneSummaryDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  description: nullableText,
  isActive: z.boolean(),
});

export const zoneDetailDtoSchema = zoneSummaryDtoSchema;

export const zoneLookupDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
});

export const zoneCreateDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  description: nullableText,
});

export const zoneUpdateDtoSchema = zoneCreateDtoSchema;

export const zonePatchDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  description: nullableText,
  isActive: z.boolean().nullish(),
});

export const zoneListResponseSchema = setupResponseSchema(
  pagedResultSchema(zoneSummaryDtoSchema),
);
export const zoneDetailResponseSchema = setupResponseSchema(zoneDetailDtoSchema);
export const zoneLookupResponseSchema = setupResponseSchema(
  z.array(zoneLookupDtoSchema),
);

export type ZoneSummaryDto = z.infer<typeof zoneSummaryDtoSchema>;
export type ZoneDetailDto = z.infer<typeof zoneDetailDtoSchema>;
export type ZoneLookupDto = z.infer<typeof zoneLookupDtoSchema>;
export type ZoneCreateDto = z.infer<typeof zoneCreateDtoSchema>;
export type ZoneUpdateDto = z.infer<typeof zoneUpdateDtoSchema>;
export type ZonePatchDto = z.infer<typeof zonePatchDtoSchema>;

export type ZoneListParams = SetupListParams & {
  code?: string;
  name?: string;
};
