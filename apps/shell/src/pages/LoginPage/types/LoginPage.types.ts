export type EmailNextResult = { ok: true } | { ok: false; message: string };

export interface LoginPageProps {
  /**
   * Storybook substitutes a synchronous sign-in. Production posts to `/auth/login` and
   * navigates to the IdP `redirectUrl`.
   */
  onEmailNext?: (email: string) => Promise<EmailNextResult>;
}

export interface LoginLocationState {
  from?: { pathname: string };
  authError?: string;
}
