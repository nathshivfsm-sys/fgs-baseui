import { http } from 'msw';
import {
  jobTypeCreateDtoSchema,
  jobTypePatchDtoSchema,
  jobTypeUpdateDtoSchema,
  type JobTypeCreateDto,
  type JobTypeDetailDto,
  type JobTypeLookupDto,
  type JobTypePatchDto,
  type JobTypeSubCategoryDto,
  type JobTypeSubCategoryWriteDto,
  type JobTypeSummaryDto,
  type JobTypeUpdateDto,
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

const subcategoryLabels: Record<
  number,
  { categoryId: number; categoryName: string; name: string }
> = {
  301: {
    categoryId: 101,
    categoryName: 'Install',
    name: 'Condenser install',
  },
  302: {
    categoryId: 101,
    categoryName: 'Install',
    name: 'Air handler install',
  },
  303: {
    categoryId: 102,
    categoryName: 'Service',
    name: 'Diagnostic',
  },
  304: {
    categoryId: 104,
    categoryName: 'Warranty',
    name: 'Warranty callback',
  },
};

function toSubCategoryDetail(
  row: JobTypeSubCategoryWriteDto,
): JobTypeSubCategoryDto {
  const known = subcategoryLabels[row.jobTypeTaskId];
  return {
    categoryId: known?.categoryId ?? 0,
    categoryName: known?.categoryName ?? null,
    jobTypeTaskId: row.jobTypeTaskId,
    name: known?.name ?? null,
  };
}

function seedJobTypes(): JobTypeDetailDto[] {
  return [
    {
      id: 201,
      jobTypeCode: 'ACINST',
      name: 'AC Install',
      usedFor: 1,
      businessUnit: 'HVAC',
      showToFieldTech: true,
      showOnCustomerPortal: true,
      displayOrder: 1,
      isActive: true,
      subCategories: [
        toSubCategoryDetail({
          jobTypeTaskId: 301,
          displayOrder: 1,
          isActive: true,
        }),
        toSubCategoryDetail({
          jobTypeTaskId: 302,
          displayOrder: 2,
          isActive: true,
        }),
      ],
    },
    {
      id: 202,
      jobTypeCode: 'ACREP',
      name: 'AC Repair',
      usedFor: 2,
      businessUnit: 'HVAC',
      showToFieldTech: true,
      showOnCustomerPortal: false,
      displayOrder: 2,
      isActive: true,
      subCategories: [
        toSubCategoryDetail({
          jobTypeTaskId: 303,
          displayOrder: 1,
          isActive: true,
        }),
      ],
    },
    {
      id: 203,
      jobTypeCode: 'MAINT',
      name: 'Maintenance visit',
      usedFor: 1,
      businessUnit: 'HVAC',
      showToFieldTech: true,
      showOnCustomerPortal: true,
      displayOrder: 3,
      isActive: true,
      subCategories: [],
    },
    {
      id: 204,
      jobTypeCode: 'LEGACY',
      name: 'Legacy install',
      usedFor: 1,
      businessUnit: 'PLMB',
      showToFieldTech: false,
      showOnCustomerPortal: false,
      displayOrder: 4,
      isActive: false,
      subCategories: [
        toSubCategoryDetail({
          jobTypeTaskId: 304,
          displayOrder: 1,
          isActive: false,
        }),
      ],
    },
  ];
}

const jobTypes = seedJobTypes();

function toSummary(record: JobTypeDetailDto): JobTypeSummaryDto {
  return {
    id: record.id,
    jobTypeCode: record.jobTypeCode,
    name: record.name,
    usedFor: record.usedFor,
    businessUnit: record.businessUnit,
    showToFieldTech: record.showToFieldTech,
    showOnCustomerPortal: record.showOnCustomerPortal,
    displayOrder: record.displayOrder,
    isActive: record.isActive,
  };
}

function toLookup(record: JobTypeDetailDto): JobTypeLookupDto {
  return {
    id: record.id,
    jobTypeCode: record.jobTypeCode,
    name: record.name,
    displayOrder: record.displayOrder,
  };
}

function findJobType(id: number | undefined): JobTypeDetailDto | undefined {
  return id === undefined
    ? undefined
    : jobTypes.find((record) => record.id === id);
}

function readOptionalId(url: URL, key: string): number | undefined {
  const value = url.searchParams.get(key);
  if (!value) return undefined;
  const id = Number(value);
  return Number.isInteger(id) ? id : undefined;
}

function filterJobTypes(url: URL): JobTypeDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const jobTypeCode = url.searchParams.get('jobTypeCode');
  const name = url.searchParams.get('name');
  const usedFor = readOptionalId(url, 'usedFor');
  const jobTypeTaskId = readOptionalId(url, 'jobTypeTaskId');
  const businessUnit = url.searchParams.get('businessUnit');
  const search = url.searchParams.get('search');
  return jobTypes.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      jobTypeCode &&
      (record.jobTypeCode ?? '').toLowerCase() !== jobTypeCode.toLowerCase()
    ) {
      return false;
    }
    if (
      name &&
      !(record.name ?? '').toLowerCase().includes(name.toLowerCase())
    ) {
      return false;
    }
    if (usedFor !== undefined && record.usedFor !== usedFor) return false;
    if (
      jobTypeTaskId !== undefined &&
      !record.subCategories?.some(
        (row: JobTypeSubCategoryDto) => row.jobTypeTaskId === jobTypeTaskId,
      )
    ) {
      return false;
    }
    if (
      businessUnit &&
      (record.businessUnit ?? '').toLowerCase() !== businessUnit.toLowerCase()
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.jobTypeCode,
      record.name,
      record.businessUnit,
    ]);
  });
}

function applySubCategories(
  record: JobTypeDetailDto,
  rows: JobTypeSubCategoryWriteDto[] | null | undefined,
) {
  if (rows === undefined) return;
  record.subCategories = rows?.map(toSubCategoryDetail) ?? null;
}

function createFromBody(body: JobTypeCreateDto): JobTypeDetailDto {
  return {
    id: nextId(jobTypes),
    jobTypeCode: body.jobTypeCode ?? null,
    name: body.name ?? null,
    usedFor: body.usedFor,
    businessUnit: body.businessUnit ?? null,
    showToFieldTech: body.showToFieldTech,
    showOnCustomerPortal: body.showOnCustomerPortal,
    displayOrder: body.displayOrder ?? null,
    isActive: body.isActive,
    subCategories: body.subCategories?.map(toSubCategoryDetail) ?? null,
  };
}

function applyWrite(
  record: JobTypeDetailDto,
  body: JobTypeUpdateDto | JobTypePatchDto,
) {
  const { subCategories, ...rest } = body;
  assignDefined(record, rest);
  applySubCategories(record, subCategories);
}

/**
 * In-memory `/jobtype` catalog. Nested `subCategories` reference subcategory
 * ids (`jobTypeTaskId`). Counts, lookup, and `:id` are registered so
 * `/counts` and `/lookup` are not captured as ids.
 */
export const jobTypeHandlers = [
  http.get('/api/v1/jobtype/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = jobTypes
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/jobtype/counts', ({ request }) => {
    const matches = filterJobTypes(new URL(request.url));
    return setupOk({
      activeCount: matches.filter((record) => record.isActive).length,
      inactiveCount: matches.filter((record) => !record.isActive).length,
    });
  }),

  http.get('/api/v1/jobtype/:id', ({ params }) => {
    const record = findJobType(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Job type not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/jobtype/:id', async ({ params, request }) => {
    const record = findJobType(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Job type not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = jobTypeUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    applyWrite(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/jobtype/:id', async ({ params, request }) => {
    const record = findJobType(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Job type not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = jobTypePatchDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    applyWrite(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/jobtype', ({ request }) => {
    const url = new URL(request.url);
    const page = pagedResult(filterJobTypes(url), url);
    return setupOk({
      ...page,
      items: page.items.map(toSummary),
    });
  }),

  http.post('/api/v1/jobtype', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = jobTypeCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const created = createFromBody(parsed.data);
    jobTypes.push(created);
    return setupOk(created, 201);
  }),
];
