import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../select';
import { TextInput } from '../text-input';

export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 code, used as the option value. */
  code: string;
  dialCode: string;
  flag: string;
  label: string;
}

export const DEFAULT_PHONE_COUNTRIES: readonly PhoneCountry[] = [
  { code: 'US', dialCode: '+1', flag: '🇺🇸', label: 'United States' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', label: 'Canada' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', label: 'United Kingdom' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', label: 'Australia' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', label: 'India' },
];

export interface PhoneInputProps
  extends Omit<ComponentProps<'input'>, 'size' | 'type'> {
  countries?: readonly PhoneCountry[];
  /** Controlled country code. */
  country?: string;
  countryLabel?: string;
  defaultCountry?: string;
  description?: ReactNode;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  label?: ReactNode;
  labelSize?: 'default' | 'compact';
  onCountryChange?: (code: string) => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'soft';
}

/**
 * Phone field with a segmented country selector sharing one control border,
 * matching the Service Location form.
 */
export function PhoneInput({
  countries = DEFAULT_PHONE_COUNTRIES,
  country,
  countryLabel = 'Country calling code',
  defaultCountry = countries[0]?.code,
  onCountryChange,
  placeholder = '(000) 000-0000',
  variant = 'soft',
  ...props
}: PhoneInputProps) {
  // The trigger renders the selected flag itself, so the active code is tracked
  // here even when the caller leaves `country` uncontrolled.
  const [internalCountry, setInternalCountry] = useState(defaultCountry);
  const activeCountry = country ?? internalCountry;
  const selected =
    countries.find((entry) => entry.code === activeCountry) ?? countries[0];

  return (
    <TextInput
      addOn={
        <Select
          disabled={props.disabled}
          onValueChange={(next: string | null) => {
            if (next == null) return;
            if (country === undefined) {
              setInternalCountry(next);
            }
            onCountryChange?.(next);
          }}
          value={activeCountry}
        >
          <SelectTrigger
            aria-label={countryLabel}
            // Flush left segment: no radius or outer border, only the divider
            // that separates it from the number input.
            className="h-full w-auto shrink-0 justify-start gap-1 rounded-none border-0 border-r border-r-border-soft px-2"
            variant={variant}
          >
            <span aria-hidden="true" className="text-control leading-5">
              {selected?.flag}
            </span>
          </SelectTrigger>
          <SelectContent>
            {countries.map((entry) => (
              <SelectItem key={entry.code} value={entry.code}>
                {entry.flag} {entry.label} ({entry.dialCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      inputMode="tel"
      placeholder={placeholder}
      type="tel"
      variant={variant}
      {...props}
    />
  );
}
