import { http } from 'msw';
import {
  pricingMatrixOtherCreateDtoSchema,
  pricingMatrixOtherPatchDtoSchema,
  pricingMatrixOtherUpdateDtoSchema,
  type PricingMatrixOtherCreateDto,
  type PricingMatrixOtherDetailDto,
  type PricingMatrixOtherLookupDto,
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

function seedPricingMatrixOthers(): PricingMatrixOtherDetailDto[] {
  return [
    {
      id: 1401,
      pricingMatrixId: 1001,
      categoryCode: 'PERMIT',
      name: 'Permit Fee',
      adjustmentValue: 25,
      discountPercent: null,
      isActive: true,
    },
    {
      id: 1402,
      pricingMatrixId: 1001,
      categoryCode: 'DISPOSAL',
      name: 'Disposal',
      adjustmentValue: null,
      discountPercent: 5,
      isActive: true,
    },
    {
      id: 1403,
      pricingMatrixId: 1003,
      categoryCode: 'TRIP',
      name: 'Trip Charge',
      adjustmentValue: 15,
      discountPercent: null,
      isActive: false,
    },
  ];
}

const pricingMatrixOthers = seedPricingMatrixOthers();

function toLookup(
  record: PricingMatrixOtherDetailDto,
): PricingMatrixOtherLookupDto {
  return {
    id: record.id,
    pricingMatrixId: record.pricingMatrixId,
    categoryCode: record.categoryCode,
    name: record.name,
  };
}

function findPricingMatrixOther(
  id: number | undefined,
): PricingMatrixOtherDetailDto | undefined {
  return id === undefined
    ? undefined
    : pricingMatrixOthers.find((record) => record.id === id);
}

function filterPricingMatrixOthers(url: URL): PricingMatrixOtherDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const pricingMatrixId = readOptionalNumber(url, 'pricingMatrixId');
  const categoryCode = url.searchParams.get('categoryCode');
  const search = url.searchParams.get('search');
  return pricingMatrixOthers.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      pricingMatrixId !== undefined &&
      record.pricingMatrixId !== pricingMatrixId
    ) {
      return false;
    }
    if (
      categoryCode &&
      (record.categoryCode ?? '').toLowerCase() !== categoryCode.toLowerCase()
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.categoryCode,
      record.name,
      String(record.pricingMatrixId),
    ]);
  });
}

function createFromBody(
  body: PricingMatrixOtherCreateDto,
): PricingMatrixOtherDetailDto {
  return {
    id: nextId(pricingMatrixOthers),
    pricingMatrixId: body.pricingMatrixId,
    categoryCode: body.categoryCode ?? null,
    name: body.name ?? null,
    adjustmentValue: body.adjustmentValue ?? null,
    discountPercent: body.discountPercent ?? null,
    isActive: true,
  };
}

/**
 * In-memory `/pricingmatrixother` catalog. Swagger does not publish a response
 * schema; the stored shape is the create DTO plus `id` and `isActive`.
 */
export const pricingMatrixOtherHandlers = [
  http.get('/api/v1/pricingmatrixother/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const pricingMatrixId = readOptionalNumber(url, 'pricingMatrixId');
    const items = pricingMatrixOthers
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

  http.get('/api/v1/pricingmatrixother/:id', ({ params }) => {
    const record = findPricingMatrixOther(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Pricing matrix other not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/pricingmatrixother/:id', async ({ params, request }) => {
    const record = findPricingMatrixOther(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Pricing matrix other not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixOtherUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/pricingmatrixother/:id', async ({ params, request }) => {
    const record = findPricingMatrixOther(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Pricing matrix other not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixOtherPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/pricingmatrixother', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPricingMatrixOthers(url), url));
  }),

  http.post('/api/v1/pricingmatrixother', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixOtherCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const created = createFromBody(parsed.data);
    pricingMatrixOthers.push(created);
    return setupOk(created, 201);
  }),
];
