import type { ComponentProps } from 'react';
import { TextInput } from '../text-input';

export type EmailInputFieldProps = Omit<
  ComponentProps<typeof TextInput>,
  'inputMode' | 'type'
>;

/** Email text field with browser-friendly keyboard and autocomplete defaults. */
export const EmailInputField = ({
  autoCapitalize = 'none',
  autoComplete = 'email',
  autoCorrect = 'off',
  spellCheck = false,
  ...props
}: EmailInputFieldProps) => (
  <TextInput
    autoCapitalize={autoCapitalize}
    autoComplete={autoComplete}
    autoCorrect={autoCorrect}
    inputMode="email"
    spellCheck={spellCheck}
    type="email"
    {...props}
  />
);
