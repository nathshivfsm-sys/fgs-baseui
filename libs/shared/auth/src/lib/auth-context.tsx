import type { UserDetails } from '@cms/platform-contract';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ApiError } from '@cms/shared-api';
import type { Authenticate, AuthResult, LoginCredentials } from './auth-types';
import { authenticateDemoUser } from './demo-credentials';
import { fetchAuthSessionFromRefreshToken } from './session-from-refresh-token';
import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
  type AuthSession,
} from './session';

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserDetails | null;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  /** Exchanges a refresh token (e.g. from the post-login redirect query string) for a session. */
  signInWithRefreshToken: (refreshToken: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  /** Credential check. Defaults to the demo one; supply a real adapter at bootstrap. */
  authenticate?: Authenticate;
  /**
   * `undefined` hydrates from storage (the normal app path), `null` forces an anonymous
   * session, and a session object seeds an authenticated one. The latter two exist for
   * the standalone remote dev servers and Storybook, which have no login screen.
   */
  initialSession?: AuthSession | null;
}

export function AuthProvider({
  authenticate = authenticateDemoUser,
  children,
  initialSession,
}: AuthProviderProps) {
  // Storage reads are synchronous, so hydrating in the initializer avoids both a
  // loading flag and the redirect flash an effect-based hydration would cause.
  const [session, setSession] = useState<AuthSession | null>(() =>
    initialSession === undefined ? readStoredSession() : initialSession,
  );

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      const outcome = await authenticate(credentials);
      if (!outcome.ok) return { ok: false, message: outcome.message };

      writeStoredSession(outcome.session);
      setSession(outcome.session);
      return { ok: true };
    },
    [authenticate],
  );

  const signInWithRefreshToken = useCallback(
    async (refreshToken: string): Promise<AuthResult> => {
      try {
        const session = await fetchAuthSessionFromRefreshToken(refreshToken);
        writeStoredSession(session);
        setSession(session);
        return { ok: true };
      } catch (error) {
        if (error instanceof ApiError) {
          return {
            ok: false,
            message:
              error.status === 401
                ? 'Your sign-in link expired or was rejected. Try again from the login screen.'
                : error.message,
          };
        }
        return {
          ok: false,
          message:
            'Could not complete sign-in: the authentication service is unreachable or returned an unexpected response.',
        };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  // Memoised because this value crosses the Module Federation boundary into every
  // remote — an unstable identity would re-render all of them on each host render.
  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: session !== null,
      user: session?.user ?? null,
      login,
      signInWithRefreshToken,
      logout,
    }),
    [login, logout, session, signInWithRefreshToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
