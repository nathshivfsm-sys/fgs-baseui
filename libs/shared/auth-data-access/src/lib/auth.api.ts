import { ApiError, customFetch } from '@cms/shared-api';
import {
  loginResponseSchema,
  refreshResponseSchema,
  type AuthSessionDto,
} from './auth.schema';

export const AUTH_LOGIN_ENDPOINT = '/auth/login';
export const AUTH_REFRESH_ENDPOINT = '/auth/refresh';

export type AuthLoginResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; message: string };

const describeAuthLoginFailure = (
  parsed: { data: unknown; errors: string[] },
  fallback: string,
): string => {
  if (typeof parsed.data === 'string' && parsed.data.trim()) {
    return parsed.data.trim();
  }
  if (parsed.errors.length > 0) {
    return parsed.errors.join(' ');
  }
  return fallback;
};

/**
 * Starts interactive sign-in: the API returns an IdP URL the browser must navigate to.
 * After external authentication the user returns with a refresh token in the query string.
 */
export async function requestAuthLogin(
  email: string,
): Promise<AuthLoginResult> {
  try {
    const dto = await customFetch<unknown>(AUTH_LOGIN_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    const parsed = loginResponseSchema.parse(dto);
    if (
      parsed.success &&
      typeof parsed.data === 'object' &&
      parsed.data !== null &&
      'redirectUrl' in parsed.data
    ) {
      return { ok: true, redirectUrl: parsed.data.redirectUrl };
    }

    return {
      ok: false,
      message: describeAuthLoginFailure(
        parsed,
        'Sign-in could not be started. Check the email address and try again.',
      ),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message:
          error.status === 401
            ? 'That email address is not recognised.'
            : error.message,
      };
    }
    return {
      ok: false,
      message:
        'Could not sign in: the authentication service is unreachable or returned an unexpected response.',
    };
  }
}

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
