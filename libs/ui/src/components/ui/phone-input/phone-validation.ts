import { phoneDigitsOnly } from './phone-format';

export const PHONE_INVALID_MESSAGE = 'Enter a valid phone number';

export const phoneDigitCount = (value: string): number =>
  phoneDigitsOnly(value).length;

/** Ten to fifteen digits after stripping formatting, matching Setup form schemas. */
export const isValidPhoneNumber = (value: string): boolean => {
  const digits = phoneDigitCount(value.trim());
  return digits >= 10 && digits <= 15;
};
