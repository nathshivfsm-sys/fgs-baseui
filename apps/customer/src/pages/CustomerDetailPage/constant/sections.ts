export const CUSTOMER_DETAIL_SECTIONS = [
  { id: 'customer-additional-details', label: 'Additional Details' },
  { id: 'customer-service-locations', label: 'Service Locations' },
  { id: 'customer-invoice', label: 'Invoice' },
  { id: 'customer-credit-cards', label: 'Credit Cards' },
  { id: 'customer-notes', label: 'Notes' },
  { id: 'customer-attachments', label: 'Attachments' },
  {
    id: 'customer-aging',
    label: 'Aging (Outstanding Balance)',
  },
  { id: 'customer-activity', label: 'Activity' },
] as const;

export type CustomerDetailSectionId =
  (typeof CUSTOMER_DETAIL_SECTIONS)[number]['id'];

export const CUSTOMER_DETAIL_SECTION_IDS = CUSTOMER_DETAIL_SECTIONS.map(
  (section) => section.id,
);
