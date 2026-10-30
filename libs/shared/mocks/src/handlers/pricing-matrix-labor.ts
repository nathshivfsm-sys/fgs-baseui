import { http } from 'msw';
import {
  pricingMatrixLaborCreateDtoSchema,
  pricingMatrixLaborPatchDtoSchema,
  pricingMatrixLaborUpdateDtoSchema,
  type PricingMatrixLaborCreateDto,
  type PricingMatrixLaborDetailDto,
  type PricingMatrixLaborLookupDto,
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
  readOptionalNumber,
  setupError,
  setupOk,
} from './util';

function seedPricingMatrixLabors(): PricingMatrixLaborDetailDto[] {
  return [
    {
      id: 1101,
      pricingMatrixId: 1001,
      laborRateTypeId: 1,
      techSkillLevelId: null,
      baseRate: 85,
      overtimeMultiplier: 1.5,
      doubleTimeMultiplier: 2,
      discountPercent: null,
      isActive: true,
    },
    {
      id: 1102,
      pricingMatrixId: 1001,
      laborRateTypeId: 2,
      techSkillLevelId: 3,
      baseRate: 110,
      overtimeMultiplier: 1.5,
      doubleTimeMultiplier: null,
      discountPercent: 10,
      isActive: true,
    },
    {
      id: 1103,
      pricingMatrixId: 1003,
      laborRateTypeId: 1,
      techSkillLevelId: null,
      baseRate: 70,
      overtimeMultiplier: null,
      doubleTimeMultiplier: null,
      discountPercent: null,
      isActive: false,
    },
  ];
}

const pricingMatrixLabors = seedPricingMatrixLabors();

function toLookup(
  record: PricingMatrixLaborDetailDto,
): PricingMatrixLaborLookupDto {
  return {
    id: record.id,
    pricingMatrixId: record.pricingMatrixId,
    laborRateTypeId: record.laborRateTypeId,
    baseRate: record.baseRate,
  };
}

function findPricingMatrixLabor(
  id: number | undefined,
): PricingMatrixLaborDetailDto | undefined {
  return id === undefined
    ? undefined
    : pricingMatrixLabors.find((record) => record.id === id);
}

function filterPricingMatrixLabors(url: URL): PricingMatrixLaborDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const pricingMatrixId = readOptionalNumber(url, 'pricingMatrixId');
  const search = url.searchParams.get('search');
  return pricingMatrixLabors.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      pricingMatrixId !== undefined &&
      record.pricingMatrixId !== pricingMatrixId
    ) {
      return false;
    }
    return matchesSearch(search, [
      String(record.pricingMatrixId),
      String(record.laborRateTypeId),
      String(record.baseRate),
    ]);
  });
}

function createFromBody(
  body: PricingMatrixLaborCreateDto,
): PricingMatrixLaborDetailDto {
  return {
    id: nextId(pricingMatrixLabors),
    pricingMatrixId: body.pricingMatrixId,
    laborRateTypeId: body.laborRateTypeId,
    techSkillLevelId: body.techSkillLevelId ?? null,
    baseRate: body.baseRate,
    overtimeMultiplier: body.overtimeMultiplier ?? null,
    doubleTimeMultiplier: body.doubleTimeMultiplier ?? null,
    discountPercent: body.discountPercent ?? null,
    isActive: true,
  };
}

/**
 * In-memory `/pricingmatrixlabor` catalog. Swagger does not publish a response
 * schema; the stored shape is the create DTO plus `id` and `isActive`.
 */
export const pricingMatrixLaborHandlers = [
  http.get('/api/v1/pricingmatrixlabor/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const pricingMatrixId = readOptionalNumber(url, 'pricingMatrixId');
    const items = pricingMatrixLabors
      .filter((record) => {
        if (activeOnly && !record.isActive) return false;
        if (
          pricingMatrixId !== undefined &&
          record.pricingMatrixId !== pricingMatrixId
        ) {
          return false;
        }
        return true;
      })
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/pricingmatrixlabor/:id', ({ params }) => {
    const record = findPricingMatrixLabor(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Pricing matrix labor not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/pricingmatrixlabor/:id', async ({ params, request }) => {
    const record = findPricingMatrixLabor(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Pricing matrix labor not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixLaborUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/pricingmatrixlabor/:id', async ({ params, request }) => {
    const record = findPricingMatrixLabor(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Pricing matrix labor not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixLaborPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/pricingmatrixlabor', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPricingMatrixLabors(url), url));
  }),

  http.post('/api/v1/pricingmatrixlabor', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixLaborCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const created = createFromBody(parsed.data);
    pricingMatrixLabors.push(created);
    return setupOk(created, 201);
  }),
];
