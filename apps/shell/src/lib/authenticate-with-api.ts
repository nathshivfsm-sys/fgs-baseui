import { refreshAccessToken, type AuthSessionDto } from '@cms/auth-data-access';
import type { UserDetails } from '@cms/platform-contract';
import { ApiError } from '@cms/shared-api';
import type { Authenticate, AuthOutcome } from '@cms/shared-auth';

/** `TENANT_ADMIN` -> `Tenant Admin`. The API returns roles as SCREAMING_SNAKE_CASE. */
function formatRole(role: string | undefined): string {
  if (!role) return 'User';
  return role
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function toUserDetails(user: AuthSessionDto['user']): UserDetails {
  const displayName = `${user.firstName} ${user.lastName}`.trim();
  return {
    id: user.userId,
    displayName: displayName || user.email,
    email: user.email,
    role: formatRole(user.roles[0]),
  };
}

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
    // Load-bearing, not defensive. Vite inlines every `import.meta.env.VITE_*`
    // reference as a string literal at build time, so without this guard the refresh
    // token would be baked into the production bundle by any `vite build` run on a
    // machine that has a .env.local — a committed credential in all but name.
    // `import.meta.env.DEV` becomes `false` in a build, making everything below dead
    // code the minifier drops, token literal included. Verified by grepping dist/.
    if (!import.meta.env.DEV) {
      return {
        ok: false,
        message:
          'Development-only sign-in is not available in this build. A real credential exchange is still to be implemented.',
      };
    }

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
          user: toUserDetails(session.user),
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
      // A Zod parse failure, or a transport error (offline, DNS, CORS preflight).
      return {
        ok: false,
        message:
          'Could not sign in: the authentication service is unreachable or returned an unexpected response.',
      };
    }
  };
