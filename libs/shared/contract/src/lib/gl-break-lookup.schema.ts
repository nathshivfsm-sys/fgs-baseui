import { z } from 'zod';
import { apiResponseSchema, nullableText } from './envelope.schema';

/**
 * Wire shape of `GET /glbreak/lookup` from the FGS Setup Service swagger.
 * Shared because the business-unit picker is used outside Settings.
 */
export const glBreakLookupDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  breakLevel: z.number(),
});

export const glBreakLookupResponseSchema = apiResponseSchema(
  z.array(glBreakLookupDtoSchema),
);

export type GlBreakLookupDto = z.infer<typeof glBreakLookupDtoSchema>;
