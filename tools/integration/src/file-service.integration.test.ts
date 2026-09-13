import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
} from '@cms/platform-contract';
import {
  attachmentKeys,
  attachmentListQueryOptions,
  attachmentMetadataQueryOptions,
  createAttachmentMutationOptions,
} from '@cms/shared-data-access';
import { configureCustomFetch } from '@cms/shared-api';
import {
  attachmentListResponseFixture,
  attachmentMetadataResponseFixture,
} from './fixtures/file-service-response';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  configureCustomFetch({
    baseUrl: '/api/v1',
    getAuthToken: () => 'test-token',
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  configureCustomFetch({ baseUrl: '' });
});

describe('attachment through customFetch', () => {
  it('GETs the paged list and metadata with filters', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(attachmentListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(attachmentMetadataResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      attachmentListQueryOptions({
        page: 1,
        entityType: 'Company',
        entityId: 1,
        category: 'logo',
      }),
    );
    const detail = await client.fetchQuery(
      attachmentMetadataQueryOptions('Company', 501),
    );

    expect(page.items[0]?.originalFileName).toBe('logo.png');
    expect(detail.attachmentId).toBe(501);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/attachment?page=1&entityType=Company&entityId=1&category=logo',
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      '/api/v1/attachment/Company/501/metadata',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs multipart create and invalidates attachment queries', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(attachmentMetadataResponseFixture, 201),
    );
    const client = createCmsQueryClient();
    client.setQueryData(attachmentKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createAttachmentMutationOptions(client));
    const created = await mutation.execute({
      file: new Blob(['logo'], { type: 'image/png' }),
      entityType: 'Company',
      entityId: 1,
      category: 'logo',
    });

    expect(created.attachmentId).toBe(501);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/attachment');
    expect(init?.method).toBe('POST');
    expect(init?.body).toBeInstanceOf(FormData);
    expect(init?.headers).not.toMatchObject({
      'Content-Type': 'application/json',
    });
    expect(client.getQueryState(attachmentKeys.list({}))?.isInvalidated).toBe(
      true,
    );
    disposeCmsQueryClient(client);
  });
});
