import { http, HttpResponse } from 'msw';
import {
  attachmentCreateFieldsSchema,
  type AttachmentCreateFields,
  type AttachmentMetadataDto,
} from '@cms/shared-contract';
import {
  firstIssueMessage,
  matchesSearch,
  pagedResult,
  parseRouteId,
  readOptionalBoolean,
  setupError,
  setupOk,
} from './util';

function seedAttachments(): AttachmentMetadataDto[] {
  return [
    {
      attachmentId: 501,
      tenantId: 52,
      companyId: 1,
      entityType: 'Company',
      entityId: 1,
      category: 'logo',
      originalFileName: 'logo.png',
      storedFileName: 'logo-501.png',
      contentType: 'image/png',
      fileExtension: '.png',
      fileSizeBytes: 2048,
      tags: ['branding'],
      description: 'Company logo',
      isVisibleToCustomer: true,
      isVisibleToFieldTechnician: true,
      uploadedByUserId: 9,
      uploadedByName: 'Jordan Reed',
      uploadedByType: 'User',
      createdOn: '2026-01-15T10:00:00.000Z',
      createdBy: 'Jordan Reed',
      updatedOn: null,
      updatedBy: null,
      uploadedOn: '2026-01-15T10:00:00.000Z',
      isActive: true,
      downloadUrl: '/api/v1/attachment/Company/501',
      thumbnailUrl: '/api/v1/attachment/Company/501/thumbnail',
      metadataUrl: '/api/v1/attachment/Company/501/metadata',
    },
    {
      attachmentId: 502,
      tenantId: 52,
      companyId: 1,
      entityType: 'WorkOrder',
      entityId: 88,
      category: 'photo',
      originalFileName: 'before.jpg',
      storedFileName: 'before-502.jpg',
      contentType: 'image/jpeg',
      fileExtension: '.jpg',
      fileSizeBytes: 4096,
      tags: null,
      description: 'Before photo',
      isVisibleToCustomer: false,
      isVisibleToFieldTechnician: true,
      uploadedByUserId: 9,
      uploadedByName: 'Jordan Reed',
      uploadedByType: 'User',
      createdOn: '2026-03-02T14:30:00.000Z',
      createdBy: 'Jordan Reed',
      updatedOn: null,
      updatedBy: null,
      uploadedOn: '2026-03-02T14:30:00.000Z',
      isActive: true,
      downloadUrl: '/api/v1/attachment/WorkOrder/502',
      thumbnailUrl: '/api/v1/attachment/WorkOrder/502/thumbnail',
      metadataUrl: '/api/v1/attachment/WorkOrder/502/metadata',
    },
    {
      attachmentId: 503,
      tenantId: 52,
      companyId: 1,
      entityType: 'Company',
      entityId: 1,
      category: 'document',
      originalFileName: 'w9.pdf',
      storedFileName: 'w9-503.pdf',
      contentType: 'application/pdf',
      fileExtension: '.pdf',
      fileSizeBytes: 1024,
      tags: null,
      description: 'Inactive W-9',
      isVisibleToCustomer: false,
      isVisibleToFieldTechnician: false,
      uploadedByUserId: null,
      uploadedByName: null,
      uploadedByType: null,
      createdOn: '2025-11-01T08:00:00.000Z',
      createdBy: null,
      updatedOn: null,
      updatedBy: null,
      uploadedOn: '2025-11-01T08:00:00.000Z',
      isActive: false,
      downloadUrl: '/api/v1/attachment/Company/503',
      thumbnailUrl: null,
      metadataUrl: '/api/v1/attachment/Company/503/metadata',
    },
  ];
}

const attachments = seedAttachments();

function nextAttachmentId(): number {
  return (
    attachments.reduce(
      (max, record) => Math.max(max, record.attachmentId),
      0,
    ) + 1
  );
}

function findAttachment(
  attachmentId: number | undefined,
): AttachmentMetadataDto | undefined {
  return attachmentId === undefined
    ? undefined
    : attachments.find((record) => record.attachmentId === attachmentId);
}

function readFormBoolean(form: FormData, key: string): boolean | undefined {
  const value = form.get(key);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function filterAttachments(url: URL): AttachmentMetadataDto[] {
  const entityType = url.searchParams.get('entityType');
  const entityId = url.searchParams.get('entityId');
  const category = url.searchParams.get('category');
  const contentType = url.searchParams.get('contentType');
  const extension = url.searchParams.get('extension');
  const fileName = url.searchParams.get('fileName');
  const uploadedBy = url.searchParams.get('uploadedBy');
  const uploadedByUserId = url.searchParams.get('uploadedByUserId');
  const tags = url.searchParams.get('tags');
  const search = url.searchParams.get('search');
  const isVisibleToCustomer = readOptionalBoolean(url, 'isVisibleToCustomer');
  const isVisibleToFieldTechnician = readOptionalBoolean(
    url,
    'isVisibleToFieldTechnician',
  );
  return attachments.filter((record) => {
    if (entityType && record.entityType !== entityType) return false;
    if (entityId && String(record.entityId) !== entityId) return false;
    if (category && record.category !== category) return false;
    if (contentType && record.contentType !== contentType) return false;
    if (extension && record.fileExtension !== extension) return false;
    if (
      fileName &&
      !(record.originalFileName ?? '')
        .toLowerCase()
        .includes(fileName.toLowerCase())
    ) {
      return false;
    }
    if (
      uploadedBy &&
      !(record.uploadedByName ?? '')
        .toLowerCase()
        .includes(uploadedBy.toLowerCase())
    ) {
      return false;
    }
    if (
      uploadedByUserId &&
      String(record.uploadedByUserId ?? '') !== uploadedByUserId
    ) {
      return false;
    }
    if (tags && !(record.tags ?? []).some((tag) => tag === tags)) return false;
    if (
      isVisibleToCustomer !== undefined &&
      record.isVisibleToCustomer !== isVisibleToCustomer
    ) {
      return false;
    }
    if (
      isVisibleToFieldTechnician !== undefined &&
      record.isVisibleToFieldTechnician !== isVisibleToFieldTechnician
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.originalFileName,
      record.description,
      record.category,
    ]);
  });
}

function createFromUpload(
  fields: AttachmentCreateFields,
  file: Blob,
): AttachmentMetadataDto {
  const attachmentId = nextAttachmentId();
  const entityType = fields.entityType ?? 'Company';
  const originalFileName = file instanceof File ? file.name : 'upload.bin';
  const extensionMatch = /\.[^.]+$/.exec(originalFileName);
  const fileExtension = extensionMatch?.[0] ?? null;
  return {
    attachmentId,
    tenantId: 52,
    companyId: 1,
    entityType,
    entityId: fields.entityId,
    category: fields.category ?? null,
    originalFileName,
    storedFileName: `${attachmentId}-${originalFileName}`,
    contentType: file.type || 'application/octet-stream',
    fileExtension,
    fileSizeBytes: file.size,
    tags: fields.tags ? fields.tags.split(',').map((tag) => tag.trim()) : null,
    description: fields.description ?? null,
    isVisibleToCustomer: fields.isVisibleToCustomer ?? true,
    isVisibleToFieldTechnician: fields.isVisibleToFieldTechnician ?? true,
    uploadedByUserId: 9,
    uploadedByName: 'Jordan Reed',
    uploadedByType: 'User',
    createdOn: new Date().toISOString(),
    createdBy: 'Jordan Reed',
    updatedOn: null,
    updatedBy: null,
    uploadedOn: new Date().toISOString(),
    isActive: true,
    downloadUrl: `/api/v1/attachment/${entityType}/${attachmentId}`,
    thumbnailUrl: `/api/v1/attachment/${entityType}/${attachmentId}/thumbnail`,
    metadataUrl: `/api/v1/attachment/${entityType}/${attachmentId}/metadata`,
  };
}

const placeholderBytes = new Uint8Array([137, 80, 78, 71]);

function binaryOk(): HttpResponse<Uint8Array> {
  return new HttpResponse(placeholderBytes, {
    status: 200,
    headers: { 'Content-Type': 'application/octet-stream' },
  });
}

/**
 * In-memory `/attachment` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. JSON shapes come
 * from `@cms/shared-contract`.
 */
export const attachmentHandlers = [
  http.get(
    '/api/v1/attachment/:entityType/:attachmentId/metadata',
    ({ params }) => {
      const record = findAttachment(parseRouteId(params['attachmentId']));
      if (!record) return setupError(404, 'Attachment not found.');
      return setupOk(record);
    },
  ),

  http.get(
    '/api/v1/attachment/:entityType/:attachmentId/thumbnail',
    ({ params }) => {
      const record = findAttachment(parseRouteId(params['attachmentId']));
      if (!record) return setupError(404, 'Attachment not found.');
      return binaryOk();
    },
  ),

  http.get(
    '/api/v1/attachment/:entityType/:attachmentId',
    ({ params }) => {
      const record = findAttachment(parseRouteId(params['attachmentId']));
      if (!record) return setupError(404, 'Attachment not found.');
      return binaryOk();
    },
  ),

  http.delete('/api/v1/attachment/by-entity', ({ request }) => {
    const url = new URL(request.url);
    const entityType = url.searchParams.get('entityType');
    const entityId = url.searchParams.get('entityId');
    const category = url.searchParams.get('category');
    for (let index = attachments.length - 1; index >= 0; index -= 1) {
      const record = attachments[index];
      if (!record) continue;
      if (entityType && record.entityType !== entityType) continue;
      if (entityId && String(record.entityId) !== entityId) continue;
      if (category && record.category !== category) continue;
      attachments.splice(index, 1);
    }
    return new HttpResponse<null>(null, { status: 204 });
  }),

  http.delete('/api/v1/attachment/:attachmentId', ({ params }) => {
    const attachmentId = parseRouteId(params['attachmentId']);
    const index = attachments.findIndex(
      (record) => record.attachmentId === attachmentId,
    );
    if (index < 0) return setupError(404, 'Attachment not found.');
    attachments.splice(index, 1);
    return new HttpResponse<null>(null, { status: 204 });
  }),

  http.get('/api/v1/attachment', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterAttachments(url), url));
  }),

  http.post('/api/v1/attachment', async ({ request }) => {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return setupError(400, 'Request body must be multipart form data.');
    }
    const file = form.get('file');
    if (!(file instanceof Blob)) {
      return setupError(400, 'file is required.');
    }
    const entityIdRaw = form.get('entityId');
    const parsed = attachmentCreateFieldsSchema.safeParse({
      entityType: form.get('entityType') || undefined,
      entityId: entityIdRaw == null ? undefined : Number(entityIdRaw),
      category: form.get('category') || undefined,
      description: form.get('description') || undefined,
      tags: form.get('tags') || undefined,
      isVisibleToCustomer: readFormBoolean(form, 'isVisibleToCustomer'),
      isVisibleToFieldTechnician: readFormBoolean(
        form,
        'isVisibleToFieldTechnician',
      ),
      logoVariant: form.get('logoVariant') || undefined,
    });
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const created = createFromUpload(parsed.data, file);
    attachments.push(created);
    return setupOk(created, 201);
  }),
];
