export const workOrderBookingKeys = {
  all: ['work-order-booking'] as const,
  configuration: () => [...workOrderBookingKeys.all, 'configuration'] as const,
} as const;
