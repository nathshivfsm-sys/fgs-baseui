import { ApiError } from './api-error';

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
}

let currentConfig: CustomFetchConfig = { baseUrl: '' };

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

/**
 * The single sanctioned way to call APIs from this workspace (see
 * context/coding-standards.md). Callers are responsible for validating the
 * response shape (e.g. with a Zod schema) — this function only handles transport,
 * auth header injection, and typed error mapping.
 */
export async function customFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = currentConfig.getAuthToken?.();
  const tenantId = currentConfig.getTenantId?.();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenantId ? { 'X-Tenant-Id': tenantId } : {}),
    ...options.headers,
  };

  const response = await fetch(`${currentConfig.baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      extractErrorMessage(errorBody, response.status),
    );
  }

  // A successful write may carry no body (204, or an empty 200). Parsing that as JSON
  // would throw and turn a completed save into a reported failure.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
