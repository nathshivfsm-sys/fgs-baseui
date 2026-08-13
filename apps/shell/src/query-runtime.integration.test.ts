import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CMS_QUERY_DEFAULTS,
  createCmsQueryClient,
  disposeCmsQueryClient,
  type CmsQueryErrorEvent,
  type QueryRequestContext,
} from '@cms/platform-contract';
import { leadKeys, leadListQueryOptions } from '../../lead/src/lead.queries';
import { standaloneRuntime as leadRuntime } from '../../lead/src/standalone-runtime';
import { workorderKeys } from '../../workorder/src/workorder.queries';
import { standaloneRuntime as workorderRuntime } from '../../workorder/src/standalone-runtime';
import { cmsRuntime } from './runtime';

const ownedClients = [
  cmsRuntime.queryClient,
  leadRuntime.queryClient,
  workorderRuntime.queryClient,
];

afterEach(() => {
  ownedClients.forEach(disposeCmsQueryClient);
});

describe('MFE query client ownership', () => {
  it('shares defaults while keeping standalone caches isolated', () => {
    expect(leadRuntime.queryClient).not.toBe(cmsRuntime.queryClient);
    expect(workorderRuntime.queryClient).not.toBe(cmsRuntime.queryClient);
    expect(workorderRuntime.queryClient).not.toBe(leadRuntime.queryClient);

    for (const client of ownedClients) {
      expect(client.getDefaultOptions().queries).toMatchObject({
        staleTime: 30_000,
        gcTime: 600_000,
        retry: 1,
        refetchOnWindowFocus: false,
      });
      expect(client.getDefaultOptions().mutations).toMatchObject({ retry: 0 });
    }

    expect(cmsRuntime.queryClient.getDefaultOptions()).toMatchObject(
      CMS_QUERY_DEFAULTS,
    );
  });

  it('deduplicates requests and forwards cancellation signals', async () => {
    const client = createCmsQueryClient();
    const loader = vi.fn(
      async (_tenantId: string, { signal }: QueryRequestContext) => {
        expect(signal).toBeInstanceOf(AbortSignal);
        expect(signal.aborted).toBe(false);
        return [];
      },
    );
    const options = leadListQueryOptions('northwind', loader);

    await Promise.all([client.fetchQuery(options), client.fetchQuery(options)]);

    expect(loader).toHaveBeenCalledOnce();
    disposeCmsQueryClient(client);
  });

  it('keeps feature and tenant caches independent', async () => {
    const client = cmsRuntime.queryClient;
    const northwindKey = leadKeys.list('northwind');
    const contosoKey = leadKeys.list('contoso');
    const workordersKey = workorderKeys.list('northwind');

    client.setQueryData(northwindKey, ['northwind lead']);
    client.setQueryData(contosoKey, ['contoso lead']);
    client.setQueryData(workordersKey, ['northwind workorder']);

    expect(leadRuntime.queryClient.getQueryData(northwindKey)).toBeUndefined();
    expect(client.getQueryData(workordersKey)).toEqual(['northwind workorder']);

    await client.invalidateQueries({
      queryKey: northwindKey,
      exact: true,
      refetchType: 'none',
    });

    expect(client.getQueryState(northwindKey)?.isInvalidated).toBe(true);
    expect(client.getQueryState(contosoKey)?.isInvalidated).toBe(false);
    expect(client.getQueryState(workordersKey)?.isInvalidated).toBe(false);
  });

  it('supports default overrides and global query/mutation errors', async () => {
    const events: CmsQueryErrorEvent[] = [];
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 5_000 } },
      onError: (event) => events.push(event),
    });
    const queryError = new Error('query failed');
    const mutationError = new Error('mutation failed');

    await expect(
      client.fetchQuery({
        queryKey: ['test', 'error'],
        queryFn: async () => Promise.reject(queryError),
        meta: { feature: 'test', operation: 'query-error' },
      }),
    ).rejects.toBe(queryError);

    const mutation = client.getMutationCache().build(client, {
      mutationKey: ['test', 'mutation'],
      mutationFn: async () => Promise.reject(mutationError),
      meta: { feature: 'test', operation: 'mutation-error' },
    });
    await expect(mutation.execute(undefined)).rejects.toBe(mutationError);

    expect(client.getDefaultOptions().queries?.staleTime).toBe(5_000);
    expect(events).toEqual([
      expect.objectContaining({ source: 'query', error: queryError }),
      expect.objectContaining({ source: 'mutation', error: mutationError }),
    ]);
    disposeCmsQueryClient(client);
  });
});
