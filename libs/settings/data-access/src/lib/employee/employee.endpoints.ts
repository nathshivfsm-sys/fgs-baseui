import type { EmployeeListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const employeeCollectionEndpoint = '/employee';

function appendIdList(
  search: URLSearchParams,
  key: string,
  ids: readonly number[] | undefined,
) {
  if (!ids?.length) return;
  for (const id of ids) {
    search.append(key, String(id));
  }
}

export function employeeListEndpoint(params: EmployeeListParams = {}): string {
  const { techTradeIds, techSkillIds, dispatchZoneIds, roleIds, ...rest } =
    params;
  const search = new URLSearchParams(toSearchParams(rest).replace(/^\?/, ''));
  appendIdList(search, 'techTradeIds', techTradeIds);
  appendIdList(search, 'techSkillIds', techSkillIds);
  appendIdList(search, 'dispatchZoneIds', dispatchZoneIds);
  appendIdList(search, 'roleIds', roleIds);
  const query = search.toString();
  return query ? `${employeeCollectionEndpoint}?${query}` : employeeCollectionEndpoint;
}

export function employeeDetailEndpoint(id: number): string {
  return `${employeeCollectionEndpoint}/${id}`;
}

export function employeeLookupEndpoint(activeOnly = true): string {
  return `${employeeCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
