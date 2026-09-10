import { z } from 'zod';

/**
 * The identity block returned by `/auth/refresh`. Only the fields the app actually
 * renders are declared — Zod strips unknown keys, so `tenantId`, `companyId`,
 * `permissions`, `dataAccess` and `publicEndpoints` are accepted and dropped without
 * being listed. Add them here when something starts consuming them.
 */
export const authUserSchema = z.object({
  userId: z.string(),
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
