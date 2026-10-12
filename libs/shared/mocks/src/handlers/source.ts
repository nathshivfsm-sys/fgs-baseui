import { http } from 'msw';
import {
  sourceCreateDtoSchema,
  sourcePatchDtoSchema,
  sourceUpdateDtoSchema,
  type SourceCreateDto,
  type SourceDetailDto,
  type SourceLookupDto,
} from '@cms/settings-contract';
import {
  assignDefined,
  firstIssueMessage,
  matchesSearch,
  nextId,
  pagedResult,
  parseRouteId,
  readJsonObject,
  readOptionalBoolean,
  setupError,
  setupOk,
} from './util';

function seedSources(): SourceDetailDto[] {
  return [
    {
      id: 1,
      sourceCode: 'GOOGLE_SEARCH',
      sourceName: 'Google Search',
      description: 'Organic and paid traffic from Google search results',
      isActive: true,
    },
    {
      id: 2,
      sourceCode: 'CUSTOMER_REFERRAL',
      sourceName: 'Customer Referral',
      description: 'New business referred by an existing customer',
      isActive: true,
    },
    {
      id: 3,
      sourceCode: 'WEBSITE',
      sourceName: 'Website',
      description: 'Direct traffic from the company website',
      isActive: true,
    },
    {
      id: 4,
      sourceCode: 'FACEBOOK',
      sourceName: 'Facebook',
      description: 'Social leads from Facebook campaigns',
      isActive: true,
    },
    {
      id: 5,
      sourceCode: 'INSTAGRAM',
      sourceName: 'Instagram',
      description: 'Social leads from Instagram campaigns',
      isActive: true,
    },
    {
      id: 6,
      sourceCode: 'DIRECT_MAIL',
      sourceName: 'Direct Mail',
      description: 'Postcard and mailer responses',
      isActive: true,
    },
    {
      id: 7,
      sourceCode: 'RADIO',
      sourceName: 'Radio',
      description: 'Inbound calls from radio advertising',
      isActive: true,
    },
    {
      id: 8,
      sourceCode: 'LEGACY_PHONE',
      sourceName: 'Legacy Phone List',
      description: 'Retired phone campaign',
      isActive: false,
    },
    {
      id: 9,
      sourceCode: 'OLD_PARTNER',
      sourceName: 'Old Partner Portal',
      description: 'Former partner referral channel',
      isActive: false,
    },
    {
      id: 10,
      sourceCode: 'PRINT_2019',
      sourceName: 'Print Ads 2019',
      description: 'Archived print campaign',
      isActive: false,
    },
  ];
}

const sources = seedSources();

function toLookup(record: SourceDetailDto): SourceLookupDto {
  return {
    id: record.id,
    sourceCode: record.sourceCode,
    sourceName: record.sourceName,
  };
}

function findSource(id: number | undefined): SourceDetailDto | undefined {
  return id === undefined
    ? undefined
    : sources.find((record) => record.id === id);
}

function filterSources(url: URL): SourceDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const sourceCode = url.searchParams.get('sourceCode');
  const sourceName = url.searchParams.get('sourceName');
  const search = url.searchParams.get('search');
  return sources.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      sourceCode &&
      (record.sourceCode ?? '').toLowerCase() !== sourceCode.toLowerCase()
    ) {
      return false;
    }
    if (
      sourceName &&
      !(record.sourceName ?? '')
        .toLowerCase()
        .includes(sourceName.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.sourceCode,
      record.sourceName,
      record.description,
    ]);
  });
}

function createFromBody(body: SourceCreateDto): SourceDetailDto {
  return {
    id: nextId(sources),
    sourceCode: body.sourceCode ?? null,
    sourceName: body.sourceName ?? null,
    description: body.description ?? null,
    isActive: true,
  };
}

/**
 * In-memory `/source` catalog. Mutations persist for the session so a follow-up
 * GET after invalidation shows the saved values. Request/response shapes come
 * from `@cms/settings-contract`.
 */
export const sourceHandlers = [
  http.get('/api/v1/source/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = sources
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/source/:id', ({ params }) => {
    const record = findSource(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Source not found.');
    return setupOk(record);
  }),

  http.get('/api/v1/source', ({ request }) => {
    const url = new URL(request.url);
    const sortDirection = url.searchParams.get('sortDirection') ?? 'asc';
    const filtered = [...filterSources(url)].sort((left, right) => {
      const compared = (left.sourceName ?? '').localeCompare(
        right.sourceName ?? '',
        undefined,
        { sensitivity: 'base' },
      );
      return sortDirection === 'desc' ? -compared : compared;
    });
    return setupOk(pagedResult(filtered, url));
  }),

  http.post('/api/v1/source', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = sourceCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    sources.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/source/:id', async ({ params, request }) => {
    const record = findSource(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Source not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = sourceUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/source/:id', async ({ params, request }) => {
    const record = findSource(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Source not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = sourcePatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),
];
