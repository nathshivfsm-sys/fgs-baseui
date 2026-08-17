import { ApiError } from './api-error';

export interface CustomFetchConfig {
  /** Origin + path prefix prepended to every `customFetch` endpoint, e.g. "https://api.example.com". */
  baseUrl: string;
  /** Called on every request; return `undefined` when there is no token to attach. */
  getAuthToken?: () => string | undefined;
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

function extractErrorMessage(body: unknown, status: number): string {
  if (
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof (body as { message: unknown }).message === 'string'
  ) {
    return (body as { message: string }).message;
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
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  return response.json() as Promise<T>;
}
