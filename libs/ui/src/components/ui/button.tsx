import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-control font-medium transition-[color,background-color,border-color,box-shadow,opacity] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-busy:cursor-wait aria-busy:opacity-75 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-hover/90',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 active:bg-destructive/80',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
      },
      size: {
        default: 'h-control px-4 py-2',
        sm: 'h-control-sm px-3',
        lg: 'h-control-lg px-6',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  asChild,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
