import { z } from 'zod';

/** Numeric ids arrive as numbers; the workspace keys and headers are strings. */
const optionalId = z
  .union([z.string(), z.number()])
  .nullish()
  .transform((value) => (value == null ? undefined : String(value)));

/**
 * The identity block returned by `/auth/refresh`. Only the fields the app actually
 * consumes are declared — Zod strips unknown keys, so `permissions`, `dataAccess` and
 * `publicEndpoints` are accepted and dropped without being listed. Add them here when
 * something starts consuming them.
 *
 * - `tenantId` (`52`) is sent back as the `X-Tenant-Id` header on every request; the
 *   API rejects tenant-scoped calls without it.
 * - `companyId` (`1`) is the path key for `/company/{companyId}`.
 *
 * Both tolerate nullish so sign-in never fails on them — consumers handle absence.
 */
export const authUserSchema = z.object({
  userId: z.string(),
  tenantId: optionalId,
  companyId: optionalId,
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
});

/**
 * The full response envelope. `refreshToken`, `idToken` and `expiresIn` are returned by
 * the API but deliberately not modelled: this integration sends a fixed refresh token on
 * every call and does not yet handle rotation or expiry.
 */
export const refreshResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  data: z.object({
    accessToken: z.string(),
    tokenType: z.string(),
    user: authUserSchema,
  }),
});

export type AuthUserDto = z.infer<typeof authUserSchema>;
export type RefreshResponseDto = z.infer<typeof refreshResponseSchema>;
export type AuthSessionDto = RefreshResponseDto['data'];
