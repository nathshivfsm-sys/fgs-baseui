import type { QueryClient } from '@tanstack/react-query';
import type { CustomerDetailDto } from '@cms/customer-contract';
import type { ServiceLocationOnlyForm } from '@cms/customer-data-access';

export interface CreateServiceLocationFormProps {
  onDirtyChange: (dirty: boolean) => void;
  onSubmit: (values: ServiceLocationOnlyForm) => void;
  queryClient: QueryClient;
}

export interface BillToSummaryCardProps {
  customer: CustomerDetailDto | undefined;
  errorMessage?: string | null;
  loading?: boolean;
  paymentTermLabel: string | null;
}

export interface BillToSearchFieldProps {
  onSelectCustomer: (customerId: number) => void;
  queryClient: QueryClient;
}
