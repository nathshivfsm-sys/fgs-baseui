import { http } from 'msw';
import {
  pricingMatrixCreateDtoSchema,
  pricingMatrixPatchDtoSchema,
  pricingMatrixUpdateDtoSchema,
  type PricingMatrixCreateDto,
  type PricingMatrixDetailDto,
  type PricingMatrixLookupDto,
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

function seedPricingMatrices(): PricingMatrixDetailDto[] {
  return [
    {
      id: 1001,
      code: 'STD',
      name: 'Standard',
      isDefault: true,
      isLaborTierStructure: false,
      isLaborRateBySkillLevel: false,
      priceAdjustmentTypeId: 1,
      effectiveFrom: '2026-01-01',
      effectiveTo: null,
      isMobileVisible: true,
      isActive: true,
    },
    {
      id: 1002,
      code: 'PREM',
      name: 'Premium',
      isDefault: false,
      isLaborTierStructure: true,
      isLaborRateBySkillLevel: true,
      priceAdjustmentTypeId: 2,
      effectiveFrom: '2026-06-01',
      effectiveTo: '2026-12-31',
      isMobileVisible: true,
      isActive: true,
    },
    {
      id: 1003,
      code: 'OLD',
      name: 'Retired',
      isDefault: false,
      isLaborTierStructure: false,
      isLaborRateBySkillLevel: false,
      priceAdjustmentTypeId: 1,
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      isMobileVisible: false,
      isActive: false,
    },
  ];
}

const pricingMatrices = seedPricingMatrices();

function toLookup(record: PricingMatrixDetailDto): PricingMatrixLookupDto {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
    isDefault: record.isDefault,
  };
}

function findPricingMatrix(
  id: number | undefined,
): PricingMatrixDetailDto | undefined {
  return id === undefined
    ? undefined
    : pricingMatrices.find((record) => record.id === id);
}

function normalizeName(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function findDuplicatePricingMatrix(
  name: string | null | undefined,
  excludeId?: number,
): PricingMatrixDetailDto | undefined {
  const key = normalizeName(name);
  if (!key) return undefined;
  return pricingMatrices.find(
    (record) => record.id !== excludeId && normalizeName(record.name) === key,
  );
}

function filterPricingMatrices(url: URL): PricingMatrixDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const isDefault = readOptionalBoolean(url, 'isDefault');
  const code = url.searchParams.get('code');
  const search = url.searchParams.get('search');
  return pricingMatrices.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (isDefault !== undefined && record.isDefault !== isDefault) return false;
    if (code && (record.code ?? '').toLowerCase() !== code.toLowerCase()) {
      return false;
    }
    return matchesSearch(search, [record.code, record.name]);
  });
}

function createFromBody(body: PricingMatrixCreateDto): PricingMatrixDetailDto {
  const id = nextId(pricingMatrices);
  return {
    id,
    code: `MX-${id}`,
    name: body.name ?? null,
    isDefault: body.isDefault,
    isLaborTierStructure: body.isLaborTierStructure,
    isLaborRateBySkillLevel: body.isLaborRateBySkillLevel,
    priceAdjustmentTypeId: body.priceAdjustmentTypeId ?? 1,
    effectiveFrom: body.effectiveFrom ?? '2026-01-01',
    effectiveTo: body.effectiveTo ?? null,
    isMobileVisible: body.isMobileVisible ?? true,
    isActive: true,
  };
}

/**
 * In-memory `/pricingmatrix` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`. `description` is accepted on
 * write and is not stored; swagger omits it from the read DTO. `code` is
 * assigned by the server.
 */
export const pricingMatrixHandlers = [
  http.get('/api/v1/pricingmatrix/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = pricingMatrices
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/pricingmatrix/:id', ({ params }) => {
    const record = findPricingMatrix(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Pricing matrix not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/pricingmatrix/:id', async ({ params, request }) => {
    const id = parseRouteId(params['id']);
    const record = findPricingMatrix(id);
    if (!record) return setupError(404, 'Pricing matrix not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const duplicate = findDuplicatePricingMatrix(parsed.data.name, id);
    if (duplicate) {
      return setupError(409, 'A pricing matrix with this name already exists.');
    }
    assignDefined(record, {
      name: parsed.data.name,
      isDefault: parsed.data.isDefault,
      isLaborTierStructure: parsed.data.isLaborTierStructure,
      isLaborRateBySkillLevel: parsed.data.isLaborRateBySkillLevel,
      priceAdjustmentTypeId:
        parsed.data.priceAdjustmentTypeId ?? record.priceAdjustmentTypeId,
      effectiveFrom: parsed.data.effectiveFrom ?? record.effectiveFrom,
      effectiveTo: parsed.data.effectiveTo,
      isMobileVisible: parsed.data.isMobileVisible ?? record.isMobileVisible,
    });
    return setupOk(record);
  }),

  http.patch('/api/v1/pricingmatrix/:id', async ({ params, request }) => {
    const id = parseRouteId(params['id']);
    const record = findPricingMatrix(id);
    if (!record) return setupError(404, 'Pricing matrix not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    if (parsed.data.name !== undefined) {
      const duplicate = findDuplicatePricingMatrix(parsed.data.name, id);
      if (duplicate) {
        return setupError(
          409,
          'A pricing matrix with this name already exists.',
        );
      }
    }
    const { description: _description, ...patch } = parsed.data;
    assignDefined(record, patch);
    return setupOk(record);
  }),

  http.get('/api/v1/pricingmatrix', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPricingMatrices(url), url));
  }),

  http.post('/api/v1/pricingmatrix', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = pricingMatrixCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const duplicate = findDuplicatePricingMatrix(parsed.data.name);
    if (duplicate) {
      return setupError(409, 'A pricing matrix with this name already exists.');
    }
    const created = createFromBody(parsed.data);
    pricingMatrices.push(created);
    return setupOk(created, 201);
  }),
];
