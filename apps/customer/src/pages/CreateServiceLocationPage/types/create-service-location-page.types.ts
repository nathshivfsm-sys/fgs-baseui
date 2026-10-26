import type { QueryClient } from '@tanstack/react-query';

export interface CreateServiceLocationPageProps {
  queryClient: QueryClient;
}

export interface CreateServiceLocationHeaderProps {
  customerId: number;
  customerName?: string | null;
  loading?: boolean;
  onBack: () => void;
}

export interface CreateServiceLocationFormFooterProps {
  formId: string;
  isPending: boolean;
  onCancel: () => void;
}
