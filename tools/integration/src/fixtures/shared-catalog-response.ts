/** Wire envelopes shaped from the FGS Setup Service Tag and PaymentTerm DTOs. */

const tagRow = {
  id: 1,
  tagCode: 'VIP',
  name: 'VIP',
  description: 'Priority customers',
  backgroundColor: '#FEF3C7',
  textColor: '#92400E',
  iconFileId: null,
  usageCount: 4,
  isActive: true,
};

export const tagListResponseFixture = {
  success: true,
  statusCode: 200,
  data: { items: [tagRow], page: 1, pageSize: 20, totalCount: 1 },
  errors: [] as string[],
};

export const tagDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: tagRow,
  errors: [] as string[],
};

export const tagLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [{ id: 1, tagCode: 'VIP', name: 'VIP' }],
  errors: [] as string[],
};

const paymentTermRow = {
  id: 2,
  name: 'Net 30',
  dueDateMethod: 'daysAfterInvoice',
  numberOfDays: 30,
  isAccountsReceivable: true,
  isAccountsPayable: true,
  isMobileVisible: true,
  isActive: true,
};

export const paymentTermListResponseFixture = {
  success: true,
  statusCode: 200,
  data: { items: [paymentTermRow], page: 1, pageSize: 20, totalCount: 1 },
  errors: [] as string[],
};

export const paymentTermDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: paymentTermRow,
  errors: [] as string[],
};

export const paymentTermLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [{ id: 2, name: 'Net 30' }],
  errors: [] as string[],
};
