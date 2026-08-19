import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { CheckIcon } from '../../../icons';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

const checkboxVariants = cva(
  'peer relative flex shrink-0 items-center justify-center rounded-sm border border-input-strong bg-card text-primary-foreground outline-none transition-[background-color,border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:border-brand data-checked:bg-brand aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
  {
    variants: {
      size: { sm: 'size-3.5', default: 'size-4', lg: 'size-5' },
    },
    defaultVariants: { size: 'default' },
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
  size,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      aria-invalid={invalid || undefined}
      className={cn(checkboxVariants({ size }), className)}
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
