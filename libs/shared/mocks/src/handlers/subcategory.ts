import { http } from 'msw';
import {
  subcategoryCreateDtoSchema,
  subcategoryPatchDtoSchema,
  subcategoryUpdateDtoSchema,
  type SubcategoryCreateDto,
  type SubcategoryDetailDto,
  type SubcategoryLookupDto,
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

const categoryNames: Record<number, string> = {
  101: 'Install',
  102: 'Service',
  103: 'Maintenance',
  104: 'Warranty',
};

type StoredSubcategory = SubcategoryDetailDto & {
  linkedJobTypeIds: readonly number[];
};

function seedSubcategories(): StoredSubcategory[] {
  return [
    {
      id: 301,
      jobCategoryId: 101,
      tradeId: 51,
      skillLevelId: 61,
      name: 'Condenser install',
      taskName: 'Install condenser',
      priority: 1,
      estimatedHours: 4,
      displayOrder: 1,
      isActive: true,
      categoryName: 'Install',
      linkedJobTypeIds: [201],
    },
    {
      id: 302,
      jobCategoryId: 101,
      tradeId: 51,
      skillLevelId: 62,
      name: 'Air handler install',
      taskName: 'Install air handler',
      priority: 2,
      estimatedHours: 3,
      displayOrder: 2,
      isActive: true,
      categoryName: 'Install',
      linkedJobTypeIds: [201],
    },
    {
      id: 303,
      jobCategoryId: 102,
      tradeId: 51,
      skillLevelId: 63,
      name: 'Diagnostic',
      taskName: 'Diagnose system',
      priority: 1,
      estimatedHours: 1.5,
      displayOrder: 1,
      isActive: true,
      categoryName: 'Service',
      linkedJobTypeIds: [202],
    },
    {
      id: 304,
      jobCategoryId: 104,
      tradeId: 51,
      skillLevelId: null,
      name: 'Warranty callback',
      taskName: 'Warranty visit',
      priority: 3,
      estimatedHours: 1,
      displayOrder: 4,
      isActive: false,
      categoryName: 'Warranty',
      linkedJobTypeIds: [204],
    },
  ];
}

const subcategories = seedSubcategories();

function toResponse(record: StoredSubcategory): SubcategoryDetailDto {
  return {
    id: record.id,
    jobCategoryId: record.jobCategoryId,
    tradeId: record.tradeId,
    skillLevelId: record.skillLevelId,
    name: record.name,
    taskName: record.taskName,
    priority: record.priority,
    estimatedHours: record.estimatedHours,
    displayOrder: record.displayOrder,
    isActive: record.isActive,
    categoryName: record.categoryName,
  };
}

function toLookup(record: StoredSubcategory): SubcategoryLookupDto {
  return {
    id: record.id,
    name: record.name,
  };
}

function findSubcategory(
  id: number | undefined,
): StoredSubcategory | undefined {
  return id === undefined
    ? undefined
    : subcategories.find((record) => record.id === id);
}

function readOptionalId(url: URL, key: string): number | undefined {
  const value = url.searchParams.get(key);
  if (!value) return undefined;
  const id = Number(value);
  return Number.isInteger(id) ? id : undefined;
}

function filterSubcategories(url: URL): StoredSubcategory[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const taskName = url.searchParams.get('taskName');
  const name = url.searchParams.get('name');
  const jobCategoryId = readOptionalId(url, 'jobCategoryId');
  const jobTypeId = readOptionalId(url, 'jobTypeId');
  const search = url.searchParams.get('search');
  return subcategories.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      taskName &&
      !(record.taskName ?? '').toLowerCase().includes(taskName.toLowerCase())
    ) {
      return false;
    }
    if (
      name &&
      !(record.name ?? '').toLowerCase().includes(name.toLowerCase())
    ) {
      return false;
    }
    if (jobCategoryId !== undefined && record.jobCategoryId !== jobCategoryId) {
      return false;
    }
    if (
      jobTypeId !== undefined &&
      !record.linkedJobTypeIds.includes(jobTypeId)
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.name,
      record.taskName,
      record.categoryName,
    ]);
  });
}

function createFromBody(body: SubcategoryCreateDto): StoredSubcategory {
  return {
    id: nextId(subcategories),
    jobCategoryId: body.jobCategoryId,
    tradeId: body.tradeId,
    skillLevelId: body.skillLevelId ?? null,
    name: body.name ?? null,
    taskName: body.taskName ?? null,
    priority: body.priority,
    estimatedHours: body.estimatedHours,
    displayOrder: body.displayOrder ?? null,
    isActive: body.isActive ?? true,
    categoryName: categoryNames[body.jobCategoryId] ?? null,
    linkedJobTypeIds: [],
  };
}

/**
 * In-memory `/jobtypetask` catalog. The frontend name is subcategory.
 * `jobTypeId` is a list filter only, so it stays off the response body.
 * Mutations persist for the session. Request/response shapes come from
 * `@cms/settings-contract`.
 */
export const subcategoryHandlers = [
  http.get('/api/v1/jobtypetask/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = subcategories
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/jobtypetask/:id', ({ params }) => {
    const record = findSubcategory(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Subcategory not found.');
    return setupOk(toResponse(record));
  }),

  http.put('/api/v1/jobtypetask/:id', async ({ params, request }) => {
    const record = findSubcategory(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Subcategory not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = subcategoryUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    assignDefined(record, parsed.data);
    if (parsed.data.jobCategoryId !== undefined) {
      record.categoryName = categoryNames[parsed.data.jobCategoryId] ?? null;
    }
    return setupOk(toResponse(record));
  }),

  http.patch('/api/v1/jobtypetask/:id', async ({ params, request }) => {
    const record = findSubcategory(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Subcategory not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = subcategoryPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    assignDefined(record, parsed.data);
    if (parsed.data.jobCategoryId != null) {
      record.categoryName = categoryNames[parsed.data.jobCategoryId] ?? null;
    }
    return setupOk(toResponse(record));
  }),

  http.get('/api/v1/jobtypetask', ({ request }) => {
    const url = new URL(request.url);
    const page = pagedResult(filterSubcategories(url), url);
    return setupOk({
      ...page,
      items: page.items.map(toResponse),
    });
  }),

  http.post('/api/v1/jobtypetask', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = subcategoryCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const created = createFromBody(parsed.data);
    subcategories.push(created);
    return setupOk(toResponse(created), 201);
  }),
];
