export const CUSTOMERS_LIST_PATH = '/customers';

export const CREATE_CUSTOMER_PATH = '/customers/new';

export const customerDetailPath = (customerId: number): string =>
  `/customers/${customerId}`;

export const serviceLocationCreatePath = (customerId: number): string =>
  `/customers/${customerId}/service-locations/new`;
