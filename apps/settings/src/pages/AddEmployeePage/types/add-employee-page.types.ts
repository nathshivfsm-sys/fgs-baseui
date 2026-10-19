import type { QueryClient } from '@tanstack/react-query';

export interface AddEmployeePageProps {
  queryClient: QueryClient;
}

export interface AddEmployeeHeaderProps {
  description: string;
  title: string;
}

export interface AddEmployeeFormFooterProps {
  formId: string;
  isPending: boolean;
  onCancel: () => void;
  saveLabel: string;
}

export interface EmployeeDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}
