import type { PagedResult } from '@cms/settings-contract';

export function toPagedResult<T>(data: {
  items?: readonly T[] | null;
  page: number;
  pageSize: number;
  totalCount: number;
}): PagedResult<T> {
  return {
    items: data.items ? [...data.items] : [],
    page: data.page,
    pageSize: data.pageSize,
    totalCount: data.totalCount,
  };
}
