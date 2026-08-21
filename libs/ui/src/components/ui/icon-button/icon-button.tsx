import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '../button';

const buttonSizes = {
  /** 28px: table row actions and pagination controls. */
  xs: 'iconXs',
  sm: 'iconSm',
  default: 'icon',
  lg: 'iconLg',
} as const;

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'size'> {
  icon: ReactNode;
  label: string;
  size?: keyof typeof buttonSizes;
}

/**
 * Square action button requiring an accessible label for icon-only content.
 * Pass `className` to override the radius (e.g. `rounded-sm` for pagination).
 */
export function IconButton({
  icon,
  label,
  size = 'default',
  title,
  ...props
}: IconButtonProps) {
  const buttonSize = buttonSizes[size];
  return (
    <Button
      aria-label={label}
      size={buttonSize}
      title={title ?? label}
      {...props}
    >
      {icon}
    </Button>
  );
}
