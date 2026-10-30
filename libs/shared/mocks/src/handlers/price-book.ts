import { http } from 'msw';
import {
  priceBookCreateDtoSchema,
  priceBookPatchDtoSchema,
  priceBookUpdateDtoSchema,
  type PriceBookCreateDto,
  type PriceBookDetailDto,
  type PriceBookLookupDto,
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

function seedPriceBooks(): PriceBookDetailDto[] {
  return [
    {
      id: 801,
      priceBookCode: 'TUNE',
      priceBookName: 'Tune Up',
      description: 'Seasonal tune-up flat rate',
      jobTypeId: 201,
      pricingModel: 'FLAT',
      estimatedDurationMinutes: 60,
      basePrice: 129,
      isTaxable: true,
      isActive: true,
    },
    {
      id: 802,
      priceBookCode: 'DIAG',
      priceBookName: 'Diagnostic',
      description: 'Hourly diagnostic visit',
      jobTypeId: 202,
      pricingModel: 'HOURLY',
      estimatedDurationMinutes: 30,
      basePrice: 89,
      isTaxable: true,
      isActive: true,
    },
    {
      id: 803,
      priceBookCode: 'LEGACY',
      priceBookName: 'Legacy Plan',
      description: 'Retired flat-rate book',
      jobTypeId: 201,
      pricingModel: 'FLAT',
      estimatedDurationMinutes: 45,
      basePrice: null,
      isTaxable: false,
      isActive: false,
    },
  ];
}

const priceBooks = seedPriceBooks();

function toLookup(record: PriceBookDetailDto): PriceBookLookupDto {
  return {
    id: record.id,
    priceBookCode: record.priceBookCode,
    priceBookName: record.priceBookName,
    pricingModel: record.pricingModel,
  };
}

function findPriceBook(id: number | undefined): PriceBookDetailDto | undefined {
  return id === undefined
    ? undefined
    : priceBooks.find((record) => record.id === id);
}

function normalizeCode(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function findDuplicatePriceBook(
  priceBookCode: string | null | undefined,
  excludeId?: number,
): PriceBookDetailDto | undefined {
  const key = normalizeCode(priceBookCode);
  if (!key) return undefined;
  return priceBooks.find(
    (record) =>
      record.id !== excludeId && normalizeCode(record.priceBookCode) === key,
  );
}

function filterPriceBooks(url: URL): PriceBookDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const jobTypeId = readOptionalNumber(url, 'jobTypeId');
  const pricingModel = url.searchParams.get('pricingModel');
  const priceBookCode = url.searchParams.get('priceBookCode');
  const priceBookName = url.searchParams.get('priceBookName');
  const search = url.searchParams.get('search');
  return priceBooks.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (jobTypeId !== undefined && record.jobTypeId !== jobTypeId) return false;
    if (
      pricingModel &&
      (record.pricingModel ?? '').toLowerCase() !== pricingModel.toLowerCase()
    ) {
      return false;
    }
    if (
      priceBookCode &&
      (record.priceBookCode ?? '').toLowerCase() !== priceBookCode.toLowerCase()
    ) {
      return false;
    }
    if (
      priceBookName &&
      !(record.priceBookName ?? '')
        .toLowerCase()
        .includes(priceBookName.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.priceBookCode,
      record.priceBookName,
      record.description,
    ]);
  });
}

function createFromBody(body: PriceBookCreateDto): PriceBookDetailDto {
  return {
    id: nextId(priceBooks),
    priceBookCode: body.priceBookCode ?? null,
    priceBookName: body.priceBookName ?? null,
    description: body.description ?? null,
    jobTypeId: body.jobTypeId,
    pricingModel: body.pricingModel ?? null,
    estimatedDurationMinutes: body.estimatedDurationMinutes,
    basePrice: body.basePrice ?? null,
    isTaxable: body.isTaxable,
    isActive: true,
  };
}

/**
 * In-memory `/pricebook` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const priceBookHandlers = [
  http.get('/api/v1/pricebook/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = priceBooks
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/pricebook/:id', ({ params }) => {
    const record = findPriceBook(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Price book not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/pricebook/:id', async ({ params, request }) => {
    const id = parseRouteId(params['id']);
    const record = findPriceBook(id);
    if (!record) return setupError(404, 'Price book not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = priceBookUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const duplicate = findDuplicatePriceBook(parsed.data.priceBookCode, id);
    if (duplicate) {
      return setupError(409, 'A price book with this code already exists.');
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/pricebook/:id', async ({ params, request }) => {
    const id = parseRouteId(params['id']);
    const record = findPriceBook(id);
    if (!record) return setupError(404, 'Price book not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = priceBookPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    if (parsed.data.priceBookCode !== undefined) {
      const duplicate = findDuplicatePriceBook(parsed.data.priceBookCode, id);
      if (duplicate) {
        return setupError(409, 'A price book with this code already exists.');
      }
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/pricebook', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPriceBooks(url), url));
  }),

  http.post('/api/v1/pricebook', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = priceBookCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const duplicate = findDuplicatePriceBook(parsed.data.priceBookCode);
    if (duplicate) {
      return setupError(409, 'A price book with this code already exists.');
    }
    const created = createFromBody(parsed.data);
    priceBooks.push(created);
    return setupOk(created, 201);
  }),
];
