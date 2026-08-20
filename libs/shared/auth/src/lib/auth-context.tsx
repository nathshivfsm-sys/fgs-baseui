import type { UserDetails } from '@cms/platform-contract';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Authenticate, AuthResult, LoginCredentials } from './auth-types';
import { authenticateDemoUser } from './demo-credentials';
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
      logout,
    }),
    [login, logout, session],
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
