import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';
import { BodySmall } from '../typography';

// The checked fill uses `success-strong`, not `success`. WCAG 1.4.11 wants 3:1
// for a control's boundary and for the fill that conveys its state, and the
// thumb is `bg-surface`: `--success` (#17b26a) gives only 2.76:1 against white,
// while `--success-strong` (#047857) gives 5.48:1. axe does not test 1.4.11, so
// this is not covered by the story suite.
const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-secondary outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/30 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:border-success-strong data-checked:bg-success-strong',
  {
    variants: { size: { sm: 'h-5 w-9', default: 'h-[23px] w-11' } },
    defaultVariants: { size: 'default' },
  },
);
const thumbVariants = cva(
  'pointer-events-none block rounded-full bg-surface shadow-xs transition-transform',
  {
    variants: {
      size: {
        sm: 'size-4 translate-x-0.5 data-checked:translate-x-[17px]',
        default: 'size-[19px] translate-x-0.5 data-checked:translate-x-[22px]',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export interface SwitchProps
  extends StringClassName<ComponentProps<typeof SwitchPrimitive.Root>>,
    VariantProps<typeof switchVariants> {}

/** Accessible shadcn/Base UI switch matching the Figma 44x23px default. */
export function Switch({ className, size, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={thumbVariants({ size })} />
    </SwitchPrimitive.Root>
  );
}

export interface SwitchFieldProps extends Omit<SwitchProps, 'onCheckedChange'> {
  description?: ReactNode;
  error?: ReactNode;
  helperText?: ReactNode;
  label: ReactNode;
  labelPosition?: 'before' | 'after';
  onCheckedChange?: (checked: boolean) => void;
}

export function SwitchField({
  description,
  error,
  helperText,
  id,
  label,
  labelPosition = 'before',
  onCheckedChange,
  required,
  ...props
}: SwitchFieldProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const labelId = `${switchId}-label`;
  const messageId = `${switchId}-message`;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        {labelPosition === 'before' && (
          <label
            className="text-control text-surface-foreground"
            htmlFor={switchId}
            id={labelId}
          >
            {label}
            {required && (
              <span aria-hidden="true" className="ml-1 text-destructive">
                *
              </span>
            )}
          </label>
        )}
        <Switch
          aria-describedby={
            error || helperText || description ? messageId : undefined
          }
          aria-labelledby={labelId}
          id={switchId}
          onCheckedChange={
            onCheckedChange
              ? (checked: boolean) => onCheckedChange(checked)
              : undefined
          }
          required={required}
          {...props}
        />
        {labelPosition === 'after' && (
          <label
            className="text-control text-surface-foreground"
            htmlFor={switchId}
            id={labelId}
          >
            {label}
          </label>
        )}
      </div>
      {error != null ? (
        <BodySmall color="destructive" id={messageId} role="alert">
          {error}
        </BodySmall>
      ) : (
        (helperText ?? description) != null && (
          <BodySmall color="input-foreground" id={messageId}>
            {helperText ?? description}
          </BodySmall>
        )
      )}
    </div>
  );
}

export { switchVariants };
