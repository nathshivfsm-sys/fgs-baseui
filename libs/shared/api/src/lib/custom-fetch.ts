import { ApiError } from './api-error';

/** Auth endpoints that must not trigger an access-token refresh retry loop. */
const AUTH_REFRESH_PATH = '/auth/refresh';

export interface CustomFetchConfig {
  /** Origin + path prefix prepended to every `customFetch` endpoint, e.g. "https://api.example.com". */
  baseUrl: string;
  /** Called on every request; return `undefined` when there is no token to attach. */
  getAuthToken?: () => string | undefined;
  /**
   * Called on every request; sent as `X-Tenant-Id`, which the API requires on tenant-scoped
   * endpoints. Return `undefined` when there is no tenant (e.g. before sign-in).
   */
  getTenantId?: () => string | undefined;
  /**
   * Called on every request; sent as `X-Company-Id`, which the API requires on
   * company-scoped endpoints. Return `undefined` when there is no company (e.g. before
   * sign-in).
   */
  getCompanyId?: () => string | undefined;
  /** Fired once when a 401 starts a background session refresh (e.g. show a toast). */
  onSessionRefreshStart?: () => void;
  /** Return true when a new access token was stored and the failed request may be retried. */
  refreshSession?: () => Promise<boolean>;
}

export type CustomFetchOptions = RequestInit & {
  /** Default `json`. Use `blob` for File Service download/thumbnail bytes. */
  responseType?: 'json' | 'blob';
  /** @internal Prevents infinite retry after a refresh attempt. */
  _authRetry?: boolean;
};

let currentConfig: CustomFetchConfig = { baseUrl: '' };
let refreshInFlight: Promise<boolean> | null = null;

/**
 * Sets the base URL and auth token source every subsequent `customFetch` call uses.
 * Each runtime (shell, standalone workorder, standalone lead) calls this once at
 * bootstrap — mirroring how `createCmsQueryClient` takes explicit options rather
 * than reading a global, this library makes no assumption about where the base URL
 * or token come from (env var, runtime config.json, auth provider, etc.).
 */
export function configureCustomFetch(config: CustomFetchConfig) {
  currentConfig = config;
}

function isFormDataBody(body: BodyInit | null | undefined): boolean {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

function isAuthRefreshEndpoint(endpoint: string): boolean {
  return endpoint === AUTH_REFRESH_PATH || endpoint.endsWith(AUTH_REFRESH_PATH);
}

/**
 * Prefers `message`; falls back to the API envelope's `errors: string[]`
 * (e.g. `{ success: false, errors: ["Tenant context is required. ..."] }`).
 */
function extractErrorMessage(body: unknown, status: number): string {
  if (typeof body === 'object' && body !== null) {
    const { message, errors } = body as { message?: unknown; errors?: unknown };
    if (typeof message === 'string' && message) return message;
    if (Array.isArray(errors)) {
      const texts = errors.filter(
        (entry): entry is string => typeof entry === 'string' && entry !== '',
      );
      if (texts.length) return texts.join(' ');
    }
  }
  return `API request failed with HTTP ${status}`;
}

const coalesceSessionRefresh = async (): Promise<boolean> => {
  const refresh = currentConfig.refreshSession;
  if (!refresh) {
    return false;
  }
  if (!refreshInFlight) {
    currentConfig.onSessionRefreshStart?.();
    refreshInFlight = refresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
};

/**
 * The single sanctioned way to call APIs from this workspace (see
 * context/coding-standards.md). Callers are responsible for validating the
 * response shape (e.g. with a Zod schema) — this function only handles transport,
 * auth header injection, and typed error mapping.
 */
export async function customFetch<T>(
  endpoint: string,
  options: CustomFetchOptions = {},
): Promise<T> {
  const { responseType = 'json', headers: optionHeaders, _authRetry, ...requestInit } =
    options;
  const token = currentConfig.getAuthToken?.();
  const tenantId = currentConfig.getTenantId?.();
  const companyId = currentConfig.getCompanyId?.();
  const headers: HeadersInit = {
    ...(isFormDataBody(requestInit.body)
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenantId ? { 'X-Tenant-Id': tenantId } : {}),
    ...(companyId ? { 'X-Company-Id': companyId } : {}),
    ...optionHeaders,
  };

  const response = await fetch(`${currentConfig.baseUrl}${endpoint}`, {
    ...requestInit,
    // Catalog GETs are otherwise eligible for the browser disk cache; a refetch
    // after POST/PUT/PATCH would then replay the pre-write list.
    cache: requestInit.cache ?? 'no-store',
    headers,
  });

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => ({}));
    if (
      response.status === 401 &&
      !_authRetry &&
      !isAuthRefreshEndpoint(endpoint) &&
      currentConfig.refreshSession
    ) {
      const refreshed = await coalesceSessionRefresh();
      if (refreshed) {
        return customFetch(endpoint, { ...options, _authRetry: true });
      }
    }
    throw new ApiError(
      response.status,
      extractErrorMessage(errorBody, response.status),
    );
  }

  if (responseType === 'blob') {
    return (await response.blob()) as T;
  }

  // A successful write may carry no body (204, or an empty 200). Parsing that as JSON
  // would throw and turn a completed save into a reported failure.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
