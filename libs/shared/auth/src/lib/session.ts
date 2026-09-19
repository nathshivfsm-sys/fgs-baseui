import type { UserDetails } from '@cms/platform-contract';

export interface AuthSession {
  token: string;
  user: UserDetails;
  /** Used to obtain a new access token when the current one expires. */
  refreshToken?: string;
  /**
   * The API's tenant id from the login response, sent as `X-Tenant-Id` on every request.
   * Distinct from `CmsRuntime.tenantId`, which is the shell's display tenant.
   */
  tenantId?: string;
}

const TOKEN_KEY = 'fgs.auth.token';
const USER_KEY = 'fgs.auth.user';
const TENANT_KEY = 'fgs.auth.tenant';
const REFRESH_TOKEN_KEY = 'fgs.auth.refresh';

/**
 * `sessionStorage`, deliberately — NOT `localStorage`. A token in web storage is
 * readable by any script that gets injected into the page, so this narrows the blast
 * radius: the session dies with the tab and is never shared between tabs.
 *
 * This whole module is the seam for real authentication. Production auth must not keep
 * a token in JavaScript-reachable storage at all — the server should set an
 * httpOnly + Secure + SameSite cookie that the SPA never touches, at which point
 * `getSessionToken` and these read/write helpers disappear rather than change.
 */
function storage(): Storage | null {
  try {
    return sessionStorage;
  } catch {
    // Blocked by browser settings, or no DOM at all (node test runners).
    return null;
  }
}

function isUserDetails(value: unknown): value is UserDetails {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['id'] === 'string' &&
    typeof candidate['displayName'] === 'string' &&
    typeof candidate['email'] === 'string' &&
    typeof candidate['role'] === 'string'
  );
}

/** Reads the persisted session, returning null when absent or malformed. */
export function readStoredSession(): AuthSession | null {
  const store = storage();
  if (!store) return null;
  try {
    const token = store.getItem(TOKEN_KEY);
    const rawUser = store.getItem(USER_KEY);
    if (!token || !rawUser) return null;
    const user: unknown = JSON.parse(rawUser);
    if (!isUserDetails(user)) return null;
    const tenantId = store.getItem(TENANT_KEY);
    const refreshToken = store.getItem(REFRESH_TOKEN_KEY) ?? undefined;
    return {
      token,
      user,
      ...(refreshToken ? { refreshToken } : {}),
      ...(tenantId ? { tenantId } : {}),
    };
  } catch {
    return null;
  }
}

export function writeStoredSession(session: AuthSession): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(TOKEN_KEY, session.token);
    store.setItem(USER_KEY, JSON.stringify(session.user));
    if (session.tenantId) {
      store.setItem(TENANT_KEY, session.tenantId);
    } else {
      store.removeItem(TENANT_KEY);
    }
    if (session.refreshToken) {
      store.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    } else {
      store.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch {
    // Quota or private-mode failure: the in-memory session still works for this tab.
  }
}

export function clearStoredSession(): void {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(TOKEN_KEY);
    store.removeItem(USER_KEY);
    store.removeItem(TENANT_KEY);
    store.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}

/**
 * Non-React token accessor for `configureCustomFetch({ getAuthToken })`. Each runtime
 * wires this once at bootstrap so every `customFetch` call carries the current token.
 * It reads storage directly rather than mirroring React state, so it stays correct no
 * matter when a request fires relative to the provider mounting.
 */
export function getSessionToken(): string | undefined {
  return readStoredSession()?.token;
}

/** Non-React accessor for `configureCustomFetch({ getTenantId })`, read per request. */
export function getSessionTenantId(): string | undefined {
  return readStoredSession()?.tenantId;
}

/** Non-React accessor for `configureCustomFetch({ getCompanyId })`, read per request. */
export function getSessionCompanyId(): string | undefined {
  return readStoredSession()?.user.companyId;
}
