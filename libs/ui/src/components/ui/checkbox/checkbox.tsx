import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { CheckIcon } from '../../../icons';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

const checkboxVariants = cva(
  'peer relative flex shrink-0 items-center justify-center border border-input-strong bg-card text-primary-foreground outline-none transition-[background-color,border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
  {
    variants: {
      size: { sm: 'size-3.5', default: 'size-4', lg: 'size-5' },
      /** The designs use a 2px radius in forms and 4px in table headers. */
      radius: { xs: 'rounded-xs', sm: 'rounded-sm' },
      tone: {
        brand: 'data-checked:border-brand data-checked:bg-brand',
        /** Interactive blue used by the Service Location screens. */
        action:
          'data-checked:border-action data-checked:bg-action data-checked:text-action-foreground',
      },
    },
    defaultVariants: { size: 'default', radius: 'sm', tone: 'brand' },
  },
);

export interface CheckboxProps
  extends StringClassName<ComponentProps<typeof CheckboxPrimitive.Root>>,
    VariantProps<typeof checkboxVariants> {
  invalid?: boolean;
}

/** Figma-aligned 16px checkbox supporting checked, indeterminate, and invalid states. */
export function Checkbox({
  className,
  invalid,
  radius,
  size,
  tone,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      aria-invalid={invalid || undefined}
      className={cn(checkboxVariants({ radius, size, tone }), className)}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex items-center justify-center text-current [&_svg]:size-3"
        data-slot="checkbox-indicator"
      >
        {props.indeterminate ? (
          <span
            aria-hidden="true"
            className="h-0.5 w-2 rounded-full bg-current"
          />
        ) : (
          <CheckIcon />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { checkboxVariants };
