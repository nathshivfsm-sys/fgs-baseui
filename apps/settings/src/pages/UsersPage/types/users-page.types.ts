import type { QueryClient } from '@tanstack/react-query';
import type { CatalogStatusFilter } from '../../../shared';

export interface UsersPageProps {
  queryClient: QueryClient;
}

export type UserStatusFilter = CatalogStatusFilter;
