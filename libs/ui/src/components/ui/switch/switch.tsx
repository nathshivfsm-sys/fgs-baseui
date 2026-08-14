import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '../../../lib/cn';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-secondary outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-toggle-active data-[state=checked]:bg-toggle-active',
  {
    variants: { size: { sm: 'h-5 w-9', default: 'h-[23px] w-11' } },
    defaultVariants: { size: 'default' },
  },
);
const thumbVariants = cva(
  'pointer-events-none block rounded-full bg-card shadow-xs transition-transform',
  {
    variants: {
      size: {
        sm: 'size-4 translate-x-0.5 data-[state=checked]:translate-x-[17px]',
        default:
          'size-[19px] translate-x-0.5 data-[state=checked]:translate-x-[22px]',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export interface SwitchProps
  extends ComponentProps<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

/** Accessible shadcn/Radix switch matching the Figma 44x23px default. */
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

export interface SwitchFieldProps extends SwitchProps {
  description?: ReactNode;
  error?: ReactNode;
  helperText?: ReactNode;
  label: ReactNode;
  labelPosition?: 'before' | 'after';
}

export function SwitchField({
  description,
  error,
  helperText,
  id,
  label,
  labelPosition = 'before',
  required,
  ...props
}: SwitchFieldProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const messageId = `${switchId}-message`;
  return (
    <div className="flex flex-col gap-1 font-form">
      <div className="flex items-center gap-4">
        {labelPosition === 'before' && (
          <label
            className="text-control text-card-foreground"
            htmlFor={switchId}
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
          id={switchId}
          required={required}
          {...props}
        />
        {labelPosition === 'after' && (
          <label
            className="text-control text-card-foreground"
            htmlFor={switchId}
          >
            {label}
          </label>
        )}
      </div>
      {error != null ? (
        <p
          className="text-control text-destructive"
          id={messageId}
          role="alert"
        >
          {error}
        </p>
      ) : (
        (helperText ?? description) != null && (
          <p className="text-control text-field-foreground" id={messageId}>
            {helperText ?? description}
          </p>
        )
      )}
    </div>
  );
}

export { switchVariants };
