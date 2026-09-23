import { delay, HttpResponse } from 'msw';

/** Pause mock responses so table skeletons and Save/Delete loaders are visible. */
export const MOCK_RESPONSE_DELAY_MS = 1000;

export async function setupDelay(): Promise<void> {
  await delay(MOCK_RESPONSE_DELAY_MS);
}

export async function setupOk<T>(data: T, statusCode = 200) {
  await setupDelay();
  return HttpResponse.json(
    {
      success: true,
      statusCode,
      data,
      errors: [] as string[],
    },
    { status: statusCode },
  );
}

export async function setupError(statusCode: number, message: string) {
  await setupDelay();
  return HttpResponse.json(
    {
      success: false,
      statusCode,
      errors: [message],
    },
    { status: statusCode },
  );
}

export async function setupNoContent() {
  await setupDelay();
  return new HttpResponse<null>(null, { status: 204 });
}

export async function readJsonObject(
  request: Request,
): Promise<
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; response: Awaited<ReturnType<typeof setupError>> }
> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: await setupError(400, 'Request body must be JSON.'),
    };
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return {
      ok: false,
      response: await setupError(400, 'Request body must be a JSON object.'),
    };
  }

  return { ok: true, value: body as Record<string, unknown> };
}

export async function readJsonBody(
  request: Request,
): Promise<
  | { ok: true; value: unknown }
  | { ok: false; response: Awaited<ReturnType<typeof setupError>> }
> {
  try {
    return { ok: true, value: await request.json() };
  } catch {
    return {
      ok: false,
      response: await setupError(400, 'Request body must be JSON.'),
    };
  }
}

export function parseRouteId(
  value: string | readonly string[] | undefined,
): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined) return undefined;
  const id = Number(raw);
  return Number.isInteger(id) ? id : undefined;
}

export function readOptionalBoolean(
  url: URL,
  key: string,
): boolean | undefined {
  const value = url.searchParams.get(key);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export function pagedResult<T>(items: readonly T[], url: URL) {
  const page = Number(url.searchParams.get('page') ?? '1') || 1;
  const pageSize = Number(url.searchParams.get('pageSize') ?? '25') || 25;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalCount: items.length,
  };
}

export function matchesSearch(
  search: string | null,
  fields: readonly (string | null | undefined)[],
): boolean {
  const needle = search?.trim().toLowerCase();
  if (!needle) return true;
  return fields.some((field) => (field ?? '').toLowerCase().includes(needle));
}

export function nextId(records: readonly { id: number }[]): number {
  return records.reduce((max, record) => Math.max(max, record.id), 0) + 1;
}

export function assignDefined(record: object, patch: object): void {
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) {
      Object.assign(record, { [key]: value });
    }
  }
}

export function firstIssueMessage(
  error: { issues: readonly { message: string }[] },
  fallback = 'Invalid request body.',
): string {
  return error.issues[0]?.message ?? fallback;
}
