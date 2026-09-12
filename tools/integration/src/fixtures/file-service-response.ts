/** Wire envelopes shaped from the FGS File Service swagger DTOs. */

export const attachmentListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
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
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const attachmentMetadataResponseFixture = {
  success: true,
  statusCode: 200,
  data: attachmentListResponseFixture.data.items[0],
  errors: [] as string[],
};
