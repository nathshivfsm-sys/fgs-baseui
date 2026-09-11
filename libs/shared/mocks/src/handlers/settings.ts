import { http, HttpResponse } from 'msw';

/**
 * Seeded from the redacted live `GET /company/1` capture
 * (`tools/integration/src/fixtures/company-response.ts`). Extra keys the Zod
 * schema strips are kept so the mock envelope matches the real contract.
 *
 * Not imported from `@cms/settings-data-access`: that lib is `scope:settings`,
 * and this one is `scope:shared`.
 */
function createCompanyRecord() {
  return {
    id: 52,
    tenantId: 52,
    companyNumber: 1,
    companyGuid: '00000000-0000-4000-8000-000000000000',
    code: 'acme-field-services-ae23b1',
    name: 'Acme Field Services',
    legalName: 'Acme Field Services',
    email: 'owner@acme.example.com',
    phoneNumber: '15551234567',
    website: 'https://acme.example.com',
    taxId: null as string | null,
    companySize: '11-50' as string | null,
    timeZone: 'America/Chicago',
    isActive: true,
    physicalAddress: {
      id: 'da3ddd01-0fb8-4903-94ea-18a06d0a5cbc',
      addressLine1: '100 Main St',
      addressLine2: null as string | null,
      addressLine3: null as string | null,
      addressLine4: null as string | null,
      city: 'Austin',
      state: 'TX',
      county: null as string | null,
      country: 'US',
      postalCode: '78701',
      formattedAddress: '100 Main St, Austin, TX 78701, US',
      latitude: 30.2672,
      longitude: -97.7431,
      placeId: null as string | null,
      isActive: true,
    },
    billingAddress: {
      id: 'da3ddd01-0fb8-4903-94ea-18a06d0a5cbc',
      addressLine1: '100 Main St',
      addressLine2: null as string | null,
      addressLine3: null as string | null,
      addressLine4: null as string | null,
      city: 'Austin',
      state: 'TX',
      county: null as string | null,
      country: 'US',
      postalCode: '78701',
      formattedAddress: '100 Main St, Austin, TX 78701, US',
      latitude: 30.2672,
      longitude: -97.7431,
      placeId: null as string | null,
      isActive: true,
    },
  };
}

type CompanyRecord = ReturnType<typeof createCompanyRecord>;

const companies = new Map<string, CompanyRecord>();

function getOrCreateCompany(companyId: string): CompanyRecord {
  const existing = companies.get(companyId);
  if (existing) return existing;
  const created = createCompanyRecord();
  companies.set(companyId, created);
  return created;
}

function companyResponse(data: CompanyRecord) {
  return {
    success: true,
    statusCode: 200,
    data,
    errors: [] as string[],
  };
}

/**
 * Intercepts `GET` / `PATCH /company/{companyId}`. PATCH is kept in memory so
 * the mutation's follow-up GET (cache invalidation) shows the saved values.
 */
export const settingsHandlers = [
  http.get('/api/v1/company/:companyId', ({ params }) => {
    const companyId = String(params['companyId'] ?? '');
    return HttpResponse.json(companyResponse(getOrCreateCompany(companyId)));
  }),

  http.patch('/api/v1/company/:companyId', async ({ params, request }) => {
    const companyId = String(params['companyId'] ?? '');
    const record = getOrCreateCompany(companyId);

    let patch: unknown;
    try {
      patch = await request.json();
    } catch {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          errors: ['Request body must be JSON.'],
        },
        { status: 400 },
      );
    }

    if (typeof patch !== 'object' || patch === null || Array.isArray(patch)) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          errors: ['Request body must be a JSON object.'],
        },
        { status: 400 },
      );
    }

    Object.assign(record, patch);
    return new HttpResponse(null, { status: 204 });
  }),
];
