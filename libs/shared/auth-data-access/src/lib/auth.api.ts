import { customFetch } from '@cms/shared-api';
import { refreshResponseSchema, type AuthSessionDto } from './auth.schema';

export const AUTH_REFRESH_ENDPOINT = '/auth/refresh';

/**
 * Exchanges a refresh token for an access token and the caller's identity.
 *
 * The one unauthenticated call in the workspace: `customFetch` omits the Authorization
 * header when there is no session yet, which is exactly right here — the response is
 * what creates the session.
 *
 * Typed as `unknown` on the way in so the Zod parse, not the type parameter, is what
 * guarantees the shape (see the Data Fetching section of context/coding-standards.md).
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthSessionDto> {
  const dto = await customFetch<unknown>(AUTH_REFRESH_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  return refreshResponseSchema.parse(dto).data;
}
