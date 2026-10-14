export interface PermissionToggleProps {
  checked: boolean;
  disabled?: boolean;
  id: string;
  label?: string;
  onCheckedChange: (checked: boolean) => void;
}
