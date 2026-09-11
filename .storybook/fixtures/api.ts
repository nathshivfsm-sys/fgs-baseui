import { configureCustomFetch } from '@cms/shared-api';

/**
 * One API seam for every story, at the same place the integration tests put theirs:
 * global `fetch`, with `configureCustomFetch` pointed at a story base URL.
 *
 * This is deliberately *not* per-endpoint prop injection. A remote's `AppProps` stays
 * `{ runtime }` however many endpoints a screen grows, and a story exercises the real
 * path — `customFetch`, its headers, the Zod parse, the mappers — instead of replacing
 * it with a stub function.
 */
export const STORY_API_BASE_URL = '/api/v1';
export const STORY_API_TOKEN = 'story-access-token';

export type ApiHandler = (request: Request) => Response | Promise<Response>;

/**
 * Keys are `"<METHOD> <endpoint>"`, where the endpoint is relative to
 * `STORY_API_BASE_URL` and so matches what a data-access lib passes to `customFetch`
 * — e.g. `"GET /company/story-company"`.
 */
export type ApiHandlers = Record<string, ApiHandler>;

export interface RecordedRequest {
  method: string;
  /** Relative to `STORY_API_BASE_URL`, matching the handler keys. */
  endpoint: string;
  headers: Headers;
  /** Parsed JSON body, or `undefined` for a request that carried none. */
  body: unknown;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** A request that never settles, for asserting on a loading state. */
export const pendingResponse: ApiHandler = () =>
  new Promise<Response>(() => undefined);

export interface StoryApi {
  /** Every request the story made, in order, for asserting on a write. */
  requests: RecordedRequest[];
  /**
   * Call from a story's `beforeEach` and return the result — Storybook runs the
   * returned cleanup after the story, restoring the real `fetch`.
   */
  install: (handlers: ApiHandlers) => () => void;
}

export function createStoryApi(): StoryApi {
  const requests: RecordedRequest[] = [];
  // Captured once, at module load: `install` can run twice for one story (meta level
  // then story level), and re-reading it there would make the stub its own "real".
  const realFetch = globalThis.fetch;
  let handlers: ApiHandlers = {};

  const stub: typeof fetch = async (input, init) => {
    const request = new Request(input, init);
    const { pathname } = new URL(request.url, globalThis.location.origin);
    const endpoint = pathname.startsWith(STORY_API_BASE_URL)
      ? pathname.slice(STORY_API_BASE_URL.length)
      : pathname;
    // Cloned so the handler still sees an unread body.
    const text = await request.clone().text();
    requests.push({
      method: request.method,
      endpoint,
      headers: request.headers,
      body: text ? JSON.parse(text) : undefined,
    });

    const handler = handlers[`${request.method} ${endpoint}`];
    if (!handler) {
      throw new Error(
        `No story API handler for "${request.method} ${endpoint}". Add one in the story's beforeEach.`,
      );
    }
    return handler(request);
  };

  return {
    requests,
    install(next) {
      handlers = next;
      requests.length = 0;
      globalThis.fetch = stub;
      configureCustomFetch({
        baseUrl: STORY_API_BASE_URL,
        getAuthToken: () => STORY_API_TOKEN,
      });
      return () => {
        globalThis.fetch = realFetch;
        handlers = {};
        configureCustomFetch({ baseUrl: '' });
      };
    },
  };
}
