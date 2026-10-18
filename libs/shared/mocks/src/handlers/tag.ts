import { http } from 'msw';
import {
  tagCreateDtoSchema,
  tagPatchDtoSchema,
  tagUpdateDtoSchema,
  type TagCreateDto,
  type TagDetailDto,
  type TagLookupDto,
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

function seedTags(): TagDetailDto[] {
  return [
    {
      id: 501,
      tagCode: 'VIP',
      name: 'VIP Customer',
      description: 'High-value repeat customer',
      backgroundColor: '#1F4E79',
      textColor: '#FFFFFF',
      iconFileId: 12,
      entities: ['WORK_ORDER'],
      usageCount: 42,
      isActive: true,
    },
    {
      id: 502,
      tagCode: 'WARR',
      name: 'Warranty',
      description: 'Work covered under warranty',
      backgroundColor: '#548235',
      textColor: '#FFFFFF',
      iconFileId: null,
      entities: ['EQUIPMENT'],
      usageCount: 18,
      isActive: true,
    },
    {
      id: 503,
      tagCode: 'LEGACY',
      name: 'Legacy tag',
      description: 'Retired tag kept for history',
      backgroundColor: '#7F7F7F',
      textColor: '#FFFFFF',
      iconFileId: null,
      entities: null,
      usageCount: 0,
      isActive: false,
    },
  ];
}

const tags = seedTags();

function toLookup(record: TagDetailDto): TagLookupDto {
  return {
    id: record.id,
    tagCode: record.tagCode,
    name: record.name,
  };
}

function findTag(id: number | undefined): TagDetailDto | undefined {
  return id === undefined ? undefined : tags.find((record) => record.id === id);
}

function filterTags(url: URL): TagDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const tagCode = url.searchParams.get('tagCode');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return tags.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      tagCode &&
      (record.tagCode ?? '').toLowerCase() !== tagCode.toLowerCase()
    ) {
      return false;
    }
    if (
      name &&
      !(record.name ?? '').toLowerCase().includes(name.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.tagCode,
      record.name,
      record.description,
    ]);
  });
}

function createFromBody(body: TagCreateDto): TagDetailDto {
  return {
    id: nextId(tags),
    tagCode: body.tagCode ?? null,
    name: body.name ?? null,
    description: body.description ?? null,
    backgroundColor: body.backgroundColor ?? null,
    textColor: body.textColor ?? null,
    iconFileId: body.iconFileId ?? null,
    entities: body.entities ?? null,
    usageCount: 0,
    isActive: true,
  };
}

/**
 * In-memory `/tag` catalog. Mutations persist for the session so a follow-up
 * GET after invalidation shows the saved values. Request/response shapes come
 * from `@cms/settings-contract`.
 */
export const tagHandlers = [
  http.get('/api/v1/tag/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = tags
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/tag/:id', ({ params }) => {
    const record = findTag(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tag not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/tag/:id', async ({ params, request }) => {
    const record = findTag(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tag not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = tagUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/tag/:id', async ({ params, request }) => {
    const record = findTag(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tag not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = tagPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/tag', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterTags(url), url));
  }),

  http.post('/api/v1/tag', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = tagCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    tags.push(created);
    return setupOk(created, 201);
  }),
];
