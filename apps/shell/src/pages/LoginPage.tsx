import { DEMO_CREDENTIALS, useAuth } from '@cms/shared-auth';
import { Button, Callout, LockIcon, SectionCard, TextInput } from '@cms/ui';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface LoginLocationState {
  from?: { pathname: string };
}

/** Dummy sign-in screen. Credentials are checked by `@cms/shared-auth`, not here. */
export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Set by RequireAuth when it intercepted a protected URL; '/' otherwise.
  const from =
    (location.state as LoginLocationState | null)?.from?.pathname ?? '/';

  // Declarative redirect rather than an imperative navigate() after login: a successful
  // login re-renders this component with a session, and this branch does the rest.
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await login({ email, password });
    // On success the redirect above unmounts this form, so only the failure path
    // touches state again.
    if (!result.ok) {
      setSubmitting(false);
      setError(result.message);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center p-page-compact sm:p-page">
      <SectionCard className="w-full max-w-sm">
        <h1 className="text-title font-bold text-heading">Sign in</h1>
        <p className="mt-1 text-control text-muted-foreground">
          Sign in to reach work orders, leads, and invoices.
        </p>

        <Callout
          className="mt-4"
          icon={<LockIcon className="size-4" />}
          title="Demo credentials"
        >
          The form is pre-filled with {DEMO_CREDENTIALS.email}. No real account
          is created and no request leaves the browser.
        </Callout>

        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput
            autoComplete="email"
            label="Email address"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          <TextInput
            autoComplete="current-password"
            label="Password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />

          {error !== null && <Callout variant="error">{error}</Callout>}

          <Button
            className="w-full"
            loading={submitting}
            loadingText="Signing in…"
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </SectionCard>
    </div>
  );
}
