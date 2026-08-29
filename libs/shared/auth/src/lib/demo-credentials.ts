import type { UserDetails } from '@cms/platform-contract';
import type { Authenticate, LoginCredentials } from './auth-types';
import type { AuthSession } from './session';

/**
 * Stand-in for a real identity provider. No backend exists yet (see
 * libs/shared/api/README.md), so the single accepted credential pair lives here and is
 * pre-filled into the login form.
 *
 * Comparing a password in the browser is obviously not authentication — it is a
 * placeholder for a server round-trip. When a real endpoint exists, write an
 * `Authenticate` that calls it and pass that to `AuthProvider`; this module is then
 * deleted outright rather than edited.
 */
export const DEMO_CREDENTIALS: Readonly<LoginCredentials> = Object.freeze({
  email: 'demo.admin@example.com',
  password: 'password123',
});

export const DEMO_USER: UserDetails = Object.freeze({
  id: 'user-1001',
  displayName: 'Alex Morgan',
  email: DEMO_CREDENTIALS.email,
  role: 'Operations Manager',
});

export const DEMO_SESSION: AuthSession = Object.freeze({
  token: 'demo-token.not-a-real-jwt',
  user: DEMO_USER,
});

export const authenticateDemoUser: Authenticate = async ({
  email,
  password,
}) => {
  const matches =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password;

  return matches
    ? { ok: true, session: DEMO_SESSION }
    : {
        ok: false,
        message: 'That email and password combination is not recognised.',
      };
};
