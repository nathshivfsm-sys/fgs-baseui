import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type {
  CompanyAddress,
  CompanyPatchDto,
  CompanyProfile,
} from '@cms/settings-data-access';

export interface CompanySettingsPageProps {
  /** From the login response; absent for sessions stored before it was captured. */
  companyId: string | undefined;
  queryClient: QueryClient;
}

export interface CompanySettingsEditorProps {
  companyId: string;
  queryClient: QueryClient;
}

export interface CompanySettingsFormProps {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (patch: CompanyPatchDto) => void;
  profile: CompanyProfile;
  queryClient: QueryClient;
}

export interface FormSectionProps {
  children: ReactNode;
  title: string;
}

export interface CompanyInformationSectionProps {
  code: string;
  companyNumber: string;
}

export interface AddressesSectionProps {
  billingAddress: CompanyAddress | null;
  physicalAddress: CompanyAddress | null;
}

export interface AddressCardProps {
  address: CompanyAddress | null;
  title: string;
}
