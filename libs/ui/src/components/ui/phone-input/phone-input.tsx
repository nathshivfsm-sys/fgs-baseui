import type { ChangeEvent, ComponentProps, FocusEvent } from 'react';
import { useState } from 'react';
import { TextInput } from '../text-input';
import { formatPhoneDisplay, phoneDigitsOnly } from './phone-format';

export type PhoneInputProps = Omit<
  ComponentProps<typeof TextInput>,
  'defaultValue' | 'inputMode' | 'onChange' | 'type' | 'value'
> & {
  /** Digits-only value (no spaces or punctuation). */
  value?: string;
  onValueChange?: (digits: string) => void;
};

/**
 * Phone field: digits-only in form state/API; while focused shows raw digits;
 * on blur shows a formatted display string.
 */
export const PhoneInput = ({
  autoComplete = 'tel',
  onBlur,
  onFocus,
  onValueChange,
  placeholder = '(000) 000-0000',
  value = '',
  variant = 'soft',
  ...props
}: PhoneInputProps) => {
  const [focused, setFocused] = useState(false);
  const digits = phoneDigitsOnly(value);
  const displayValue = focused ? digits : formatPhoneDisplay(digits);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(phoneDigitsOnly(event.target.value));
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <TextInput
      autoComplete={autoComplete}
      inputMode="numeric"
      maxLength={focused ? 15 : undefined}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      type="tel"
      value={displayValue}
      variant={variant}
      {...props}
    />
  );
};
