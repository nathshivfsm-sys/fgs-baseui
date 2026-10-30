import { http } from 'msw';
import {
  pricingMatrixLaborTierCreateDtoSchema,
  pricingMatrixLaborTierPatchDtoSchema,
  pricingMatrixLaborTierUpdateDtoSchema,
  type PricingMatrixLaborTierCreateDto,
  type PricingMatrixLaborTierDetailDto,
  type PricingMatrixLaborTierLookupDto,
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

function seedPricingMatrixLaborTiers(): PricingMatrixLaborTierDetailDto[] {
  return [
    {
      id: 1201,
      pricingMatrixLaborId: 1101,
      sequenceOrder: 1,
      durationMinutes: 30,
      rate: 85,
      techSkillLevelId: null,
      isActive: true,
    },
    {
      id: 1202,
      pricingMatrixLaborId: 1101,
      sequenceOrder: 2,
      durationMinutes: 60,
      rate: 75,
      techSkillLevelId: 3,
      isActive: true,
    },
    {
      id: 1203,
      pricingMatrixLaborId: 1103,
      sequenceOrder: 1,
      durationMinutes: 30,
      rate: 60,
      techSkillLevelId: null,
      isActive: false,
    },
  ];
}

const pricingMatrixLaborTiers = seedPricingMatrixLaborTiers();

function toLookup(
  record: PricingMatrixLaborTierDetailDto,
): PricingMatrixLaborTierLookupDto {
  return {
    id: record.id,
    pricingMatrixLaborId: record.pricingMatrixLaborId,
    sequenceOrder: record.sequenceOrder,
    rate: record.rate,
  };
}

function findPricingMatrixLaborTier(
  id: number | undefined,
): PricingMatrixLaborTierDetailDto | undefined {
  return id === undefined
    ? undefined
    : pricingMatrixLaborTiers.find((record) => record.id === id);
}

function filterPricingMatrixLaborTiers(
  url: URL,
): PricingMatrixLaborTierDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const pricingMatrixLaborId = readOptionalNumber(url, 'pricingMatrixLaborId');
  const search = url.searchParams.get('search');
  return pricingMatrixLaborTiers.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      pricingMatrixLaborId !== undefined &&
      record.pricingMatrixLaborId !== pricingMatrixLaborId
    ) {
      return false;
    }
    return matchesSearch(search, [
      String(record.pricingMatrixLaborId),
      String(record.sequenceOrder),
      String(record.rate),
    ]);
  });
}

function createFromBody(
  body: PricingMatrixLaborTierCreateDto,
): PricingMatrixLaborTierDetailDto {
  return {
    id: nextId(pricingMatrixLaborTiers),
    pricingMatrixLaborId: body.pricingMatrixLaborId,
    sequenceOrder: body.sequenceOrder,
    durationMinutes: body.durationMinutes,
    rate: body.rate,
    techSkillLevelId: body.techSkillLevelId ?? null,
    isActive: true,
  };
}

/**
 * In-memory `/pricingmatrixlabortier` catalog. Swagger does not publish a
 * response schema; the stored shape is the create DTO plus `id` and `isActive`.
 */
export const pricingMatrixLaborTierHandlers = [
  http.get('/api/v1/pricingmatrixlabortier/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const pricingMatrixLaborId = readOptionalNumber(
      url,
      'pricingMatrixLaborId',
    );
    const items = pricingMatrixLaborTiers
      .filter((record) => {
        if (activeOnly && !record.isActive) return false;
        if (
          pricingMatrixLaborId !== undefined &&
          record.pricingMatrixLaborId !== pricingMatrixLaborId
        ) {
          return false;
        }
        return true;
      })
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/pricingmatrixlabortier/:id', ({ params }) => {
    const record = findPricingMatrixLaborTier(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Pricing matrix labor tier not found.');
    return setupOk(record);
  }),

  http.put(
    '/api/v1/pricingmatrixlabortier/:id',
    async ({ params, request }) => {
      const record = findPricingMatrixLaborTier(parseRouteId(params['id']));
      if (!record)
        return setupError(404, 'Pricing matrix labor tier not found.');
      const body = await readJsonObject(request);
      if (!body.ok) return body.response;
      const parsed = pricingMatrixLaborTierUpdateDtoSchema.safeParse(
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
    '/api/v1/pricingmatrixlabortier/:id',
    async ({ params, request }) => {
      const record = findPricingMatrixLaborTier(parseRouteId(params['id']));
      if (!record) {
        return setupError(404, 'Pricing matrix labor tier not found.');
      }
      const body = await readJsonObject(request);
      if (!body.ok) return body.response;
      const parsed = pricingMatrixLaborTierPatchDtoSchema.safeParse(body.value);
      if (!parsed.success) {
        return setupError(400, firstIssueMessage(parsed.error));
      }
      assignDefined(record, parsed.data);
      return setupOk(record);
    },
  ),

  http.get('/api/v1/pricingmatrixlabortier', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPricingMatrixLaborTiers(url), url));
  }),

  http.post('/api/v1/pricingmatrixlabortier', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixLaborTierCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const created = createFromBody(parsed.data);
    pricingMatrixLaborTiers.push(created);
    return setupOk(created, 201);
  }),
];
