import { http } from 'msw';
import {
  pricingMatrixMaterialTierCreateDtoSchema,
  pricingMatrixMaterialTierPatchDtoSchema,
  pricingMatrixMaterialTierUpdateDtoSchema,
  type PricingMatrixMaterialTierCreateDto,
  type PricingMatrixMaterialTierDetailDto,
  type PricingMatrixMaterialTierLookupDto,
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

function seedPricingMatrixMaterialTiers(): PricingMatrixMaterialTierDetailDto[] {
  return [
    {
      id: 1301,
      pricingMatrixId: 1001,
      fromCost: 0,
      toCost: 100,
      adjustmentValue: 1.35,
      isActive: true,
    },
    {
      id: 1302,
      pricingMatrixId: 1001,
      fromCost: 100,
      toCost: null,
      adjustmentValue: 1.2,
      isActive: true,
    },
    {
      id: 1303,
      pricingMatrixId: 1003,
      fromCost: 0,
      toCost: 50,
      adjustmentValue: 1.1,
      isActive: false,
    },
  ];
}

const pricingMatrixMaterialTiers = seedPricingMatrixMaterialTiers();

function toLookup(
  record: PricingMatrixMaterialTierDetailDto,
): PricingMatrixMaterialTierLookupDto {
  return {
    id: record.id,
    pricingMatrixId: record.pricingMatrixId,
    fromCost: record.fromCost,
    toCost: record.toCost,
    adjustmentValue: record.adjustmentValue,
  };
}

function findPricingMatrixMaterialTier(
  id: number | undefined,
): PricingMatrixMaterialTierDetailDto | undefined {
  return id === undefined
    ? undefined
    : pricingMatrixMaterialTiers.find((record) => record.id === id);
}

function filterPricingMatrixMaterialTiers(
  url: URL,
): PricingMatrixMaterialTierDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const pricingMatrixId = readOptionalNumber(url, 'pricingMatrixId');
  const search = url.searchParams.get('search');
  return pricingMatrixMaterialTiers.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      pricingMatrixId !== undefined &&
      record.pricingMatrixId !== pricingMatrixId
    ) {
      return false;
    }
    return matchesSearch(search, [
      String(record.pricingMatrixId),
      String(record.fromCost),
      String(record.adjustmentValue),
    ]);
  });
}

function createFromBody(
  body: PricingMatrixMaterialTierCreateDto,
): PricingMatrixMaterialTierDetailDto {
  return {
    id: nextId(pricingMatrixMaterialTiers),
    pricingMatrixId: body.pricingMatrixId,
    fromCost: body.fromCost,
    toCost: body.toCost ?? null,
    adjustmentValue: body.adjustmentValue,
    isActive: true,
  };
}

/**
 * In-memory `/pricingmatrixmaterialtier` catalog. Swagger does not publish a
 * response schema; the stored shape is the create DTO plus `id` and `isActive`.
 */
export const pricingMatrixMaterialTierHandlers = [
  http.get('/api/v1/pricingmatrixmaterialtier/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const pricingMatrixId = readOptionalNumber(url, 'pricingMatrixId');
    const items = pricingMatrixMaterialTiers
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

  http.get('/api/v1/pricingmatrixmaterialtier/:id', ({ params }) => {
    const record = findPricingMatrixMaterialTier(parseRouteId(params['id']));
    if (!record) {
      return setupError(404, 'Pricing matrix material tier not found.');
    }
    return setupOk(record);
  }),

  http.put(
    '/api/v1/pricingmatrixmaterialtier/:id',
    async ({ params, request }) => {
      const record = findPricingMatrixMaterialTier(parseRouteId(params['id']));
      if (!record) {
        return setupError(404, 'Pricing matrix material tier not found.');
      }
      const body = await readJsonObject(request);
      if (!body.ok) return body.response;
      const parsed = pricingMatrixMaterialTierUpdateDtoSchema.safeParse(
        body.value,
      );
      if (!parsed.success) {
        return setupError(400, firstIssueMessage(parsed.error));
      }
      assignDefined(record, parsed.data);
      return setupOk(record);
    },
  ),

  http.patch(
    '/api/v1/pricingmatrixmaterialtier/:id',
    async ({ params, request }) => {
      const record = findPricingMatrixMaterialTier(parseRouteId(params['id']));
      if (!record) {
        return setupError(404, 'Pricing matrix material tier not found.');
      }
      const body = await readJsonObject(request);
      if (!body.ok) return body.response;
      const parsed = pricingMatrixMaterialTierPatchDtoSchema.safeParse(
        body.value,
      );
      if (!parsed.success) {
        return setupError(400, firstIssueMessage(parsed.error));
      }
      assignDefined(record, parsed.data);
      return setupOk(record);
    },
  ),

  http.get('/api/v1/pricingmatrixmaterialtier', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPricingMatrixMaterialTiers(url), url));
  }),

  http.post('/api/v1/pricingmatrixmaterialtier', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixMaterialTierCreateDtoSchema.safeParse(
      body.value,
    );
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const created = createFromBody(parsed.data);
    pricingMatrixMaterialTiers.push(created);
    return setupOk(created, 201);
  }),
];
