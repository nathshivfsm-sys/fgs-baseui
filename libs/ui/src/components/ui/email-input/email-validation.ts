export const EMAIL_INVALID_MESSAGE = 'Enter a valid email address';

const SIMPLE_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates a trimmed, non-empty email string (same message as Setup form schemas). */
export const isValidEmailAddress = (value: string): boolean => {
  const trimmed = value.trim();
  if (trimmed === '') return false;

  if (typeof document !== 'undefined') {
    const input = document.createElement('input');
    input.type = 'email';
    input.value = trimmed;
    return input.checkValidity();
  }

  return SIMPLE_EMAIL_PATTERN.test(trimmed);
};
