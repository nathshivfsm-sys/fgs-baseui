import type { ServiceLocationListParams } from '@cms/customer-contract';
import { customerDetailEndpoint } from '../customer/customer.endpoints';
import { toSearchParams } from '../util';

export function customerServiceLocationCollectionEndpoint(
  customerId: number,
): string {
  return `${customerDetailEndpoint(customerId)}/servicelocation`;
}

export function customerServiceLocationListEndpoint(
  customerId: number,
  params: ServiceLocationListParams = {},
): string {
  return `${customerServiceLocationCollectionEndpoint(customerId)}${toSearchParams(params)}`;
}

export function customerServiceLocationDetailEndpoint(
  customerId: number,
  locationId: number,
): string {
  return `${customerServiceLocationCollectionEndpoint(customerId)}/${locationId}`;
}
