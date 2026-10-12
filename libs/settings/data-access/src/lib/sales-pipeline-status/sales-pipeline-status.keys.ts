import type { SalesPipelineStatusListParams } from '@cms/settings-contract';

export const salesPipelineStatusKeys = {
  all: ['sales-pipeline-status'] as const,
  lists: () => [...salesPipelineStatusKeys.all, 'list'] as const,
  list: (params: SalesPipelineStatusListParams = {}) =>
    [...salesPipelineStatusKeys.lists(), params] as const,
  details: () => [...salesPipelineStatusKeys.all, 'detail'] as const,
  detail: (id: number) => [...salesPipelineStatusKeys.details(), id] as const,
  lookups: () => [...salesPipelineStatusKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...salesPipelineStatusKeys.lookups(), { activeOnly }] as const,
} as const;
