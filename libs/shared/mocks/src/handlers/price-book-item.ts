import { http } from 'msw';
import {
  priceBookItemCreateDtoSchema,
  priceBookItemPatchDtoSchema,
  priceBookItemUpdateDtoSchema,
  type PriceBookItemCreateDto,
  type PriceBookItemDetailDto,
  type PriceBookItemLookupDto,
} from '@cms/settings-contract';
import {
  assignDefined,
  firstIssueMessage,
  matchesSearch,
  nextId,
  pagedResult,
  parseRouteId,
  readJsonObject,
  readOptionalNumber,
  setupError,
  setupOk,
} from './util';

function seedPriceBookItems(): PriceBookItemDetailDto[] {
  return [
    {
      id: 901,
      priceBookId: 801,
      inventoryItemId: 11,
      itemCode: 'FILTER',
      itemDescription: 'Standard filter',
      quantity: 1,
      displayOrder: 1,
      notes: 'Replace annually',
    },
    {
      id: 902,
      priceBookId: 801,
      inventoryItemId: null,
      itemCode: 'LABOR',
      itemDescription: 'Tune-up labor',
      quantity: 1,
      displayOrder: 2,
      notes: null,
    },
    {
      id: 903,
      priceBookId: 803,
      inventoryItemId: 12,
      itemCode: 'BELT',
      itemDescription: 'Drive belt',
      quantity: 2,
      displayOrder: 1,
      notes: 'Legacy book only',
    },
  ];
}

const priceBookItems = seedPriceBookItems();

function toLookup(record: PriceBookItemDetailDto): PriceBookItemLookupDto {
  return {
    id: record.id,
    priceBookId: record.priceBookId,
    itemCode: record.itemCode,
    itemDescription: record.itemDescription,
    displayOrder: record.displayOrder,
  };
}

function findPriceBookItem(
  id: number | undefined,
): PriceBookItemDetailDto | undefined {
  return id === undefined
    ? undefined
    : priceBookItems.find((record) => record.id === id);
}

function normalizeCode(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function findDuplicatePriceBookItem(
  priceBookId: number,
  itemCode: string | null | undefined,
  excludeId?: number,
): PriceBookItemDetailDto | undefined {
  const key = normalizeCode(itemCode);
  if (!key) return undefined;
  return priceBookItems.find(
    (record) =>
      record.id !== excludeId &&
      record.priceBookId === priceBookId &&
      normalizeCode(record.itemCode) === key,
  );
}

function filterPriceBookItems(url: URL): PriceBookItemDetailDto[] {
  const priceBookId = readOptionalNumber(url, 'priceBookId');
  const itemCode = url.searchParams.get('itemCode');
  const itemDescription = url.searchParams.get('itemDescription');
  const search = url.searchParams.get('search');
  return priceBookItems.filter((record) => {
    if (priceBookId !== undefined && record.priceBookId !== priceBookId) {
      return false;
    }
    if (
      itemCode &&
      (record.itemCode ?? '').toLowerCase() !== itemCode.toLowerCase()
    ) {
      return false;
    }
    if (
      itemDescription &&
      !(record.itemDescription ?? '')
        .toLowerCase()
        .includes(itemDescription.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.itemCode,
      record.itemDescription,
      record.notes,
    ]);
  });
}

function createFromBody(body: PriceBookItemCreateDto): PriceBookItemDetailDto {
  return {
    id: nextId(priceBookItems),
    priceBookId: body.priceBookId,
    inventoryItemId: body.inventoryItemId ?? null,
    itemCode: body.itemCode ?? null,
    itemDescription: body.itemDescription ?? null,
    quantity: body.quantity,
    displayOrder: body.displayOrder ?? 0,
    notes: body.notes ?? null,
  };
}

/**
 * In-memory `/pricebookitem` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const priceBookItemHandlers = [
  http.get('/api/v1/pricebookitem/lookup', ({ request }) => {
    const url = new URL(request.url);
    const priceBookId = readOptionalNumber(url, 'priceBookId');
    const items = priceBookItems
      .filter(
        (record) =>
          priceBookId === undefined || record.priceBookId === priceBookId,
      )
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/pricebookitem/:id', ({ params }) => {
    const record = findPriceBookItem(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Price book item not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/pricebookitem/:id', async ({ params, request }) => {
    const id = parseRouteId(params['id']);
    const record = findPriceBookItem(id);
    if (!record) return setupError(404, 'Price book item not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = priceBookItemUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const duplicate = findDuplicatePriceBookItem(
      parsed.data.priceBookId,
      parsed.data.itemCode,
      id,
    );
    if (duplicate) {
      return setupError(
        409,
        'A price book item with this code already exists in the price book.',
      );
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/pricebookitem/:id', async ({ params, request }) => {
    const id = parseRouteId(params['id']);
    const record = findPriceBookItem(id);
    if (!record) return setupError(404, 'Price book item not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = priceBookItemPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    if (
      parsed.data.itemCode !== undefined ||
      parsed.data.priceBookId !== undefined
    ) {
      const duplicate = findDuplicatePriceBookItem(
        parsed.data.priceBookId ?? record.priceBookId,
        parsed.data.itemCode ?? record.itemCode,
        id,
      );
      if (duplicate) {
        return setupError(
          409,
          'A price book item with this code already exists in the price book.',
        );
      }
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.delete('/api/v1/pricebookitem/:id', ({ params }) => {
    const id = parseRouteId(params['id']);
    const index = priceBookItems.findIndex((record) => record.id === id);
    if (index < 0) return setupError(404, 'Price book item not found.');
    const [removed] = priceBookItems.splice(index, 1);
    return setupOk(removed);
  }),

  http.get('/api/v1/pricebookitem', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPriceBookItems(url), url));
  }),

  http.post('/api/v1/pricebookitem', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = priceBookItemCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const duplicate = findDuplicatePriceBookItem(
      parsed.data.priceBookId,
      parsed.data.itemCode,
    );
    if (duplicate) {
      return setupError(
        409,
        'A price book item with this code already exists in the price book.',
      );
    }
    const created = createFromBody(parsed.data);
    priceBookItems.push(created);
    return setupOk(created, 201);
  }),
];
