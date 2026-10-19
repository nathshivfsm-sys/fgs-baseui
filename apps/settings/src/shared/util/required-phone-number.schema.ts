import {
  isValidPhoneNumber,
  PHONE_INVALID_MESSAGE,
  phoneDigitsOnly,
} from '@cms/ui';
import { z } from 'zod';

/** Required phone field: digits-only form state, 10–15 digits after stripping. */
export const requiredPhoneNumberSchema = z
  .string()
  .refine((value) => phoneDigitsOnly(value).length > 0, 'Phone is required')
  .refine((value) => isValidPhoneNumber(value), PHONE_INVALID_MESSAGE);
