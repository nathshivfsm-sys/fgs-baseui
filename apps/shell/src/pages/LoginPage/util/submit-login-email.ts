import { requestAuthLogin } from '@cms/auth-data-access';
import type { EmailNextResult } from '../types';

export const submitLoginEmail = async (
  email: string,
): Promise<EmailNextResult> => {
  const result = await requestAuthLogin(email.trim());
  if (!result.ok) {
    return result;
  }

  window.location.assign(result.redirectUrl);
  return { ok: true };
};
