import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-control font-medium transition-[color,background-color,border-color,box-shadow,opacity] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-busy:cursor-wait [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-hover/90',
        brand:
          'bg-brand text-brand-foreground shadow-xs hover:bg-brand/90 active:bg-brand/80',
        subtle:
          'bg-brand-subtle text-brand hover:bg-brand-subtle/80 active:bg-brand-subtle/70',
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
        sm: 'h-control-sm px-3',
        default: 'h-control px-4 py-2',
        lg: 'h-control-lg px-6',
        iconSm: 'size-control-sm p-0',
        icon: 'size-control p-0',
        iconLg: 'size-control-lg p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: ReactNode;
}

/** A reusable shadcn-style action with Figma-aligned variants and loading semantics. */
export function Button({
  asChild = false,
  children,
  className,
  disabled,
  loading = false,
  loadingText,
  size,
  type,
  variant,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';
  const content =
    loading && !asChild ? (
      <>
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
        {loadingText ?? children}
      </>
    ) : (
      children
    );

  return (
    <Component
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : disabled || loading}
      type={asChild ? undefined : (type ?? 'button')}
      {...props}
    >
      {content}
    </Component>
  );
}

export { buttonVariants };
