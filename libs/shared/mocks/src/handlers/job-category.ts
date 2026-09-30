import { http } from 'msw';
import {
  jobCategoryCreateDtoSchema,
  jobCategoryPatchDtoSchema,
  jobCategoryUpdateDtoSchema,
  type JobCategoryCreateDto,
  type JobCategoryDetailDto,
  type JobCategoryLookupDto,
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

function seedJobCategories(): JobCategoryDetailDto[] {
  return [
    {
      id: 101,
      categoryCode: 'INS',
      name: 'Install',
      backgroundColor: '#1F4E79',
      textColor: '#FFFFFF',
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 102,
      categoryCode: 'SVC',
      name: 'Service',
      backgroundColor: '#0E6B4F',
      textColor: '#FFFFFF',
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 103,
      categoryCode: 'MNT',
      name: 'Maintenance',
      backgroundColor: '#8A5A00',
      textColor: '#FFFFFF',
      displayOrder: 3,
      isActive: true,
    },
    {
      id: 104,
      categoryCode: 'WAR',
      name: 'Warranty',
      backgroundColor: '#6B7280',
      textColor: '#FFFFFF',
      displayOrder: 4,
      isActive: false,
    },
  ];
}

const jobCategories = seedJobCategories();

function toLookup(record: JobCategoryDetailDto): JobCategoryLookupDto {
  return {
    id: record.id,
    categoryCode: record.categoryCode,
    name: record.name,
    displayOrder: record.displayOrder,
  };
}

function findJobCategory(
  id: number | undefined,
): JobCategoryDetailDto | undefined {
  return id === undefined
    ? undefined
    : jobCategories.find((record) => record.id === id);
}

function filterJobCategories(url: URL): JobCategoryDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const categoryCode = url.searchParams.get('categoryCode');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return jobCategories.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      categoryCode &&
      (record.categoryCode ?? '').toLowerCase() !== categoryCode.toLowerCase()
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
      record.categoryCode,
      record.name,
      record.backgroundColor,
      record.textColor,
    ]);
  });
}

function createFromBody(body: JobCategoryCreateDto): JobCategoryDetailDto {
  return {
    id: nextId(jobCategories),
    categoryCode: body.categoryCode ?? null,
    name: body.name ?? null,
    backgroundColor: body.backgroundColor ?? null,
    textColor: body.textColor ?? null,
    displayOrder: body.displayOrder ?? null,
    isActive: body.isActive,
  };
}

/**
 * In-memory `/jobcategory` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const jobCategoryHandlers = [
  http.get('/api/v1/jobcategory/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = jobCategories
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/jobcategory/:id', ({ params }) => {
    const record = findJobCategory(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Job category not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/jobcategory/:id', async ({ params, request }) => {
    const record = findJobCategory(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Job category not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = jobCategoryUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/jobcategory/:id', async ({ params, request }) => {
    const record = findJobCategory(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Job category not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = jobCategoryPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/jobcategory', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterJobCategories(url), url));
  }),

  http.post('/api/v1/jobcategory', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = jobCategoryCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const created = createFromBody(parsed.data);
    jobCategories.push(created);
    return setupOk(created, 201);
  }),
];
