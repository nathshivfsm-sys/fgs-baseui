import { http } from 'msw';
import {
  techSkillLevelCreateDtoSchema,
  techSkillLevelPatchDtoSchema,
  techSkillLevelUpdateDtoSchema,
  type TechSkillLevelCreateDto,
  type TechSkillLevelDetailDto,
  type TechSkillLevelLookupDto,
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

function seedTechSkillLevels(): TechSkillLevelDetailDto[] {
  return [
    {
      id: 61,
      code: 'APPR',
      name: 'Apprentice',
      description: 'Entry-level technician',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 62,
      code: 'JOUR',
      name: 'Journeyman',
      description: 'Fully qualified technician',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 63,
      code: 'MAST',
      name: 'Master',
      description: 'Senior technician',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 64,
      code: 'LEAD',
      name: 'Lead',
      description: 'Crew lead',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: 65,
      code: 'INTR',
      name: 'Intern',
      description: 'Training-only skill level',
      sortOrder: 99,
      isActive: false,
    },
  ];
}

const techSkillLevels = seedTechSkillLevels();

function toLookup(record: TechSkillLevelDetailDto): TechSkillLevelLookupDto {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
    sortOrder: record.sortOrder,
  };
}

function findTechSkillLevel(
  id: number | undefined,
): TechSkillLevelDetailDto | undefined {
  return id === undefined
    ? undefined
    : techSkillLevels.find((record) => record.id === id);
}

function filterTechSkillLevels(url: URL): TechSkillLevelDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const code = url.searchParams.get('code');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return techSkillLevels.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (code && (record.code ?? '').toLowerCase() !== code.toLowerCase()) {
      return false;
    }
    if (name && !(record.name ?? '').toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    return matchesSearch(search, [record.code, record.name, record.description]);
  });
}

function createFromBody(body: TechSkillLevelCreateDto): TechSkillLevelDetailDto {
  return {
    id: nextId(techSkillLevels),
    code: body.code ?? null,
    name: body.name ?? null,
    description: body.description ?? null,
    sortOrder: body.sortOrder ?? null,
    isActive: true,
  };
}

/**
 * In-memory `/techskilllevel` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const techSkillLevelHandlers = [
  http.get('/api/v1/techskilllevel/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = techSkillLevels
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/techskilllevel/:id', ({ params }) => {
    const record = findTechSkillLevel(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tech skill level not found.');
    return setupOk(record);
  }),

  http.get('/api/v1/techskilllevel', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterTechSkillLevels(url), url));
  }),

  http.post('/api/v1/techskilllevel', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = techSkillLevelCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    techSkillLevels.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/techskilllevel/:id', async ({ params, request }) => {
    const record = findTechSkillLevel(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tech skill level not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = techSkillLevelUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/techskilllevel/:id', async ({ params, request }) => {
    const record = findTechSkillLevel(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tech skill level not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = techSkillLevelPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),
];
