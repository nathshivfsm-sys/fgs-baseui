import type { AuthSession } from './session';

export interface LoginCredentials {
  email: string;
  password: string;
}

/** What `useAuth().login` reports back to a login form. */
export type AuthResult = { ok: true } | { ok: false; message: string };

/** What an authentication adapter reports back to `AuthProvider`. */
export type AuthOutcome =
  | { ok: true; session: AuthSession }
  | { ok: false; message: string };

/**
 * The pluggable credential check. `AuthProvider` owns session mechanics only; swapping
 * this function is how real authentication replaces the demo one — no change to the
 * provider, the guard, or any consumer.
 */
export type Authenticate = (
  credentials: LoginCredentials,
) => Promise<AuthOutcome>;
