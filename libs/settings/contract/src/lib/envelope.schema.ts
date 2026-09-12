import { z } from 'zod';

export const nullableText = z.string().nullish();

/**
 * Shared `ApiResponse<T>` envelope from the FGS Setup Service swagger.
 * Extra keys (`errors`) are stripped rather than listed.
 */
export function setupResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    statusCode: z.number(),
    data: dataSchema,
  });
}

export function pagedResultSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema).nullish(),
    page: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
  });
}

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export type SortDirection = 'asc' | 'desc';

export type SetupListParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  search?: string;
  isActive?: boolean;
};
