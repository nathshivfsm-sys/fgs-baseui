import type {
  CompanyAddress,
  CompanyAddressForm,
} from '@cms/settings-data-access';

export type CompanyAddressKind = 'billing' | 'physical';

export interface AddressCardProps {
  address: CompanyAddress | null;
  onEdit: () => void;
  title: string;
}

export interface AddressFormDialogProps {
  address: CompanyAddress | null;
  kind: CompanyAddressKind;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CompanyAddressForm) => void;
  open: boolean;
  physicalAddress: CompanyAddress | null;
}

export interface AddressFormFieldsProps {
  kind: CompanyAddressKind;
  physicalAddress: CompanyAddress | null;
}
