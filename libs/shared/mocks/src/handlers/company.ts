import { http, HttpResponse } from 'msw';
import { companyPatchDtoSchema } from '@cms/settings-contract';
import {
  assignDefined,
  firstIssueMessage,
  readJsonObject,
  setupError,
  setupOk,
} from './util';

/**
 * Seeded from the redacted live `GET /company/1` capture
 * (`tools/integration/src/fixtures/company-response.ts`). Extra keys the Zod
 * schema strips are kept so the mock envelope matches the real contract.
 */
function seedCompany() {
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

type CompanyRecord = ReturnType<typeof seedCompany>;

const companies = new Map<string, CompanyRecord>();

function getOrCreateCompany(companyId: string): CompanyRecord {
  const existing = companies.get(companyId);
  if (existing) return existing;
  const created = seedCompany();
  companies.set(companyId, created);
  return created;
}

/**
 * In-memory `/company/{companyId}`. PATCH persists for the session so the
 * mutation's follow-up GET shows the saved values. Request/response shapes
 * come from `@cms/settings-contract`.
 */
export const companyHandlers = [
  http.get('/api/v1/company/:companyId', ({ params }) => {
    const companyId = String(params['companyId'] ?? '');
    if (!companyId) return setupError(404, 'Company not found.');
    return setupOk(getOrCreateCompany(companyId));
  }),

  http.patch('/api/v1/company/:companyId', async ({ params, request }) => {
    const companyId = String(params['companyId'] ?? '');
    if (!companyId) return setupError(404, 'Company not found.');
    const record = getOrCreateCompany(companyId);
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = companyPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return new HttpResponse<null>(null, { status: 204 });
  }),
];
