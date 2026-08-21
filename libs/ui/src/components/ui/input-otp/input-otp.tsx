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

/**
 * Row of slots. Per the Login designs the cells are separate rounded boxes with
 * an 8px gap that share the row width, so the group grows to its container and
 * each slot flexes inside it.
 */
export function InputOTPGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full items-center gap-2', className)}
      data-slot="input-otp-group"
      {...props}
    />
  );
}

export interface InputOTPSlotProps extends ComponentProps<'div'> {
  /** Zero-based position of the character this slot displays. */
  index: number;
}

/**
 * Single character cell; reads its character and caret state from `InputOTP`.
 *
 * Geometry matches the Login designs: 52px tall, 8px radius, `--input` hairline
 * on a card surface. Cells grow to fill the row and fall back to
 * `--spacing-otp-slot` wide when the container is unconstrained. The digit
 * typography and the active, invalid, and disabled states are NOT specified in
 * Figma (every cell there is empty) and follow the library's form conventions.
 */
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
        'relative flex h-otp-slot min-w-0 grow basis-otp-slot items-center justify-center rounded-md border border-input bg-card font-form text-body font-semibold text-card-foreground outline-none transition-[border-color,box-shadow] aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/30',
        className,
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-card-foreground motion-reduce:animate-none" />
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
