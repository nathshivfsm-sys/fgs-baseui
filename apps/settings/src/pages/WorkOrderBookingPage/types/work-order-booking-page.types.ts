import type { QueryClient } from '@tanstack/react-query';
import type { WorkOrderBookingFormValues } from '@cms/settings-data-access';

export interface WorkOrderBookingPageProps {
  queryClient: QueryClient;
}

export interface WorkOrderBookingHeaderProps {
  auditUpdatedBy?: string | null;
  auditUpdatedOn?: string | null;
  canEdit: boolean;
  formId: string;
  isDirty: boolean;
  isPending: boolean;
}

export interface WorkOrderBookingConfigurationFormProps {
  businessUnitOptions: readonly { value: string; label: string }[];
  canEdit: boolean;
  formId: string;
  isPending: boolean;
  isSequenceLocked: boolean;
  onDirtyChange: (dirty: boolean) => void;
  onValidSubmit: (values: WorkOrderBookingFormValues) => void;
  values: WorkOrderBookingFormValues;
}
