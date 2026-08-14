import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '../button';

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'size'> {
  icon: ReactNode;
  label: string;
  size?: 'sm' | 'default' | 'lg';
}

/** Square action button requiring an accessible label for icon-only content. */
export function IconButton({
  icon,
  label,
  size = 'default',
  title,
  ...props
}: IconButtonProps) {
  const buttonSize =
    size === 'sm' ? 'iconSm' : size === 'lg' ? 'iconLg' : 'icon';
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
