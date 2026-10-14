import { Checkbox } from '@cms/ui';
import type { PermissionToggleProps } from '../types';

export const PermissionToggle = ({
  checked,
  disabled,
  id,
  label,
  onCheckedChange,
}: PermissionToggleProps) => (
  <Checkbox
    aria-label={label}
    checked={checked}
    disabled={disabled}
    id={id}
    onCheckedChange={onCheckedChange}
  />
);
