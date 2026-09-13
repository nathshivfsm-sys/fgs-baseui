import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, configureCustomFetch, customFetch } from '@cms/shared-api';

const fetchMock = vi.fn<typeof fetch>();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  configureCustomFetch({ baseUrl: '' });
});

describe('customFetch headers', () => {
  it('sends X-Tenant-Id and the bearer token when both are configured', async () => {
    configureCustomFetch({
      baseUrl: '/api/v1',
      getAuthToken: () => 'token',
      getTenantId: () => '52',
    });
    fetchMock.mockResolvedValue(jsonResponse({}));

    await customFetch('/company/1');

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
      Authorization: 'Bearer token',
      'X-Tenant-Id': '52',
    });
  });

  it('omits X-Tenant-Id when there is no tenant (e.g. before sign-in)', async () => {
    configureCustomFetch({ baseUrl: '', getTenantId: () => undefined });
    fetchMock.mockResolvedValue(jsonResponse({}));

    await customFetch('/auth/refresh');

    expect(fetchMock.mock.calls[0]?.[1]?.headers).not.toHaveProperty(
      'X-Tenant-Id',
    );
  });
});

describe('customFetch bodies', () => {
  beforeEach(() => configureCustomFetch({ baseUrl: '' }));

  it('resolves undefined for 204 No Content instead of throwing', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(
      customFetch('/company/1', { method: 'PATCH' }),
    ).resolves.toBeUndefined();
  });

  it('still parses a JSON body', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: 1 }));

    await expect(customFetch('/x')).resolves.toEqual({ ok: 1 });
  });

  it('omits JSON Content-Type when the body is FormData', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }, 201));
    const form = new FormData();
    form.append('file', new Blob(['x']));

    await customFetch('/attachment', { method: 'POST', body: form });

    expect(fetchMock.mock.calls[0]?.[1]?.headers).not.toMatchObject({
      'Content-Type': 'application/json',
    });
    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(form);
  });

  it('returns a Blob when responseType is blob', async () => {
    fetchMock.mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
      }),
    );

    const body = await customFetch<Blob>('/attachment/Company/501', {
      responseType: 'blob',
    });

    expect(body).toBeInstanceOf(Blob);
  });
});

describe('customFetch error messages', () => {
  beforeEach(() => configureCustomFetch({ baseUrl: '' }));

  it('uses the API envelope errors[] when there is no message', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          success: false,
          statusCode: 400,
          data: null,
          errors: [
            'Tenant context is required. Include the X-Tenant-Id header.',
          ],
        },
        400,
      ),
    );

    const failure = customFetch('/company/1');

    await expect(failure).rejects.toBeInstanceOf(ApiError);
    await expect(failure).rejects.toMatchObject({
      status: 400,
      message: 'Tenant context is required. Include the X-Tenant-Id header.',
    });
  });

  it('prefers message over errors[]', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ message: 'Primary', errors: ['Secondary'] }, 422),
    );

    await expect(customFetch('/x')).rejects.toMatchObject({
      message: 'Primary',
    });
  });

  it('falls back to the HTTP status when the body has neither', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ errors: [] }, 500));

    await expect(customFetch('/x')).rejects.toMatchObject({
      message: 'API request failed with HTTP 500',
    });
  });
});
