import { OTPInput, OTPInputContext } from 'input-otp';
import type { ComponentProps } from 'react';
import { useContext } from 'react';
import { MinusIcon } from '../../../icons';
import { cn } from '../../../lib/cn';

/** Intersection rather than `interface extends`: `OTPInput`'s props are a union. */
export type InputOTPProps = ComponentProps<typeof OTPInput> & {
  /** Applied to the wrapper that lays out the groups, not the hidden field. */
  containerClassName?: string;
};

/**
 * One-time-code field. Compose `InputOTPGroup`/`InputOTPSlot` inside `render`
 * (or as children) so the slot count matches `maxLength`.
 */
export function InputOTP({
  className,
  containerClassName,
  ...props
}: InputOTPProps) {
  return (
    <OTPInput
      className={cn('disabled:cursor-not-allowed', className)}
      containerClassName={cn(
        'flex items-center has-disabled:opacity-50',
        containerClassName,
      )}
      data-slot="input-otp"
      spellCheck={false}
      {...props}
    />
  );
}

/** Groups adjacent slots so they render as one segmented control. */
export function InputOTPGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center rounded-md has-aria-invalid:border-destructive has-aria-invalid:ring-[3px] has-aria-invalid:ring-destructive/20',
        className,
      )}
      data-slot="input-otp-group"
      {...props}
    />
  );
}

export interface InputOTPSlotProps extends ComponentProps<'div'> {
  /** Zero-based position of the character this slot displays. */
  index: number;
}

/** Single character cell; reads its character and caret state from `InputOTP`. */
export function InputOTPSlot({
  className,
  index,
  ...props
}: InputOTPSlotProps) {
  const context = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = context?.slots[index] ?? {};

  return (
    <div
      className={cn(
        'relative flex size-control-sm items-center justify-center border-y border-r border-input-strong bg-card font-form text-control text-card-foreground outline-none transition-[border-color,box-shadow] first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/30',
        className,
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-card-foreground motion-reduce:animate-none" />
        </div>
      )}
    </div>
  );
}

export interface InputOTPSeparatorProps extends ComponentProps<'div'> {
  /** Replaces the default dash. */
  children?: ComponentProps<'div'>['children'];
}

/** Visual divider between groups; hidden from assistive technology. */
export function InputOTPSeparator({
  children,
  className,
  ...props
}: InputOTPSeparatorProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex items-center px-1 text-icon-muted [&_svg]:size-3',
        className,
      )}
      data-slot="input-otp-separator"
      {...props}
    >
      {children ?? <MinusIcon />}
    </div>
  );
}
