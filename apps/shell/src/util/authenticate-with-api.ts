import { refreshAccessToken } from '@cms/auth-data-access';
import { ApiError } from '@cms/shared-api';
import {
  mapAuthUserDtoToUserDetails,
  type Authenticate,
  type AuthOutcome,
} from '@cms/shared-auth';

/**
 * Real authentication adapter, replacing `authenticateDemoUser` for the running app.
 *
 * Local development only. There is no interactive sign-in yet, so this trades a fixed
 * refresh token from `apps/shell/.env.local` for an access token — which means the
 * `credentials` argument is unused: the endpoint takes only `refreshToken`, and the
 * identity that comes back is whoever that token belongs to, not whoever was typed into
 * the form. Replace this with a real credential exchange when one exists; nothing else
 * in `@cms/shared-auth` changes when it does.
 *
 * The returned access token lands in the session, which `getSessionToken` feeds to
 * `configureCustomFetch` in `runtime.ts` — so every later request from the shell and
 * from every federated remote carries it as a bearer token.
 */
export const authenticateWithApi: Authenticate =
  async (): Promise<AuthOutcome> => {
    const refreshToken = import.meta.env.VITE_DEV_REFRESH_TOKEN;

    if (!refreshToken) {
      return {
        ok: false,
        message:
          'No refresh token configured. Set VITE_DEV_REFRESH_TOKEN in apps/shell/.env.local (see .env.example).',
      };
    }

    try {
      const session = await refreshAccessToken(refreshToken);
      return {
        ok: true,
        session: {
          token: session.accessToken,
          user: mapAuthUserDtoToUserDetails(session.user),
          refreshToken,
          ...(session.user.tenantId ? { tenantId: session.user.tenantId } : {}),
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          ok: false,
          message:
            error.status === 401
              ? 'The configured refresh token was rejected. It may have expired — replace VITE_DEV_REFRESH_TOKEN.'
              : error.message,
        };
      }
      return {
        ok: false,
        message:
          'Could not sign in: the authentication service is unreachable or returned an unexpected response.',
      };
    }
  };
