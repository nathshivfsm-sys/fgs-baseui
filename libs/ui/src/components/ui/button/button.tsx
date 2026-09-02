import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
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
        /** Interactive blue from the Service Location screens. */
        action:
          'bg-action text-action-foreground hover:bg-action-hover active:bg-action-hover/90',
        subtle:
          'bg-action-subtle text-primary hover:bg-action-subtle/80 active:bg-action-subtle/70',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 active:bg-destructive/80',
        outline:
          'border border-input bg-background shadow-xs hover:bg-primary-subtle hover:text-primary-subtle-foreground active:bg-primary-subtle/80',
        /**
         * White card surface with a divider-weight hairline: the Import,
         * Export, Filter, Columns, and Cancel actions in the Figma designs.
         */
        surface:
          'border border-divider bg-surface text-foreground hover:bg-secondary/60 active:bg-secondary',
        ghost:
          'hover:bg-primary-subtle hover:text-primary-subtle-foreground active:bg-primary-subtle/80',
      },
      size: {
        sm: 'h-8 px-3',
        default: 'h-9 px-4 py-2',
        lg: 'h-10 px-6',
        /** 34px toolbar density; hugs content like the Figma auto-layout. */
        compact: 'min-h-9 px-3 py-1.5',
        /** 38px page-header and footer action density. */
        comfortable: 'min-h-10 px-4 py-2',
        iconXs: 'size-7 p-0',
        iconSm: 'size-8 p-0',
        icon: 'size-9 p-0',
        iconLg: 'size-10 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: ReactNode;
  render?: useRender.RenderProp;
}

/** A reusable shadcn-style action with Figma-aligned variants and loading semantics. */
export function Button({
  children,
  className,
  disabled,
  loading = false,
  loadingText,
  render,
  size,
  type,
  variant,
  ...props
}: ButtonProps) {
  const custom = render !== undefined;
  const content =
    loading && !custom ? (
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

  return useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(
      {
        'aria-busy': loading || undefined,
        'aria-disabled': disabled || loading || undefined,
        className: cn(buttonVariants({ variant, size }), className),
        ...(custom
          ? {}
          : { disabled: disabled || loading, type: type ?? 'button' }),
      },
      props,
      { children: content },
    ),
  });
}

export { buttonVariants };
