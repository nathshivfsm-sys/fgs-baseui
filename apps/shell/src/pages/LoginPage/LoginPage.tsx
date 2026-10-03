import { DEMO_CREDENTIALS, useAuth } from '@cms/shared-auth';
import {
  BodySmall,
  Button,
  Callout,
  ChevronRightIcon,
  Heading1,
  LockIcon,
  MailIcon,
  MobileIcon,
  PhoneLineIcon,
  SectionCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextInput,
} from '@cms/ui';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { LoginLocationState, LoginPageProps } from './types';
import { submitLoginEmail } from './util';

type IdentifierTab = 'phone' | 'email';

/**
 * "Verify your account" screen. Only the Email tab reaches real
 * authentication — Mobile Phone renders for visual parity with the Figma
 * design, but there is no SMS backend to send a code to, so its Next button
 * stays disabled and submits nothing.
 */
export function LoginPage({ onEmailNext = submitLoginEmail }: LoginPageProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<IdentifierTab>('email');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const locationState = location.state as LoginLocationState | null;

  // Set by RequireAuth when it intercepted a protected URL; '/' otherwise.
  const from = locationState?.from?.pathname ?? '/today';

  useEffect(() => {
    if (locationState?.authError) {
      setError(locationState.authError);
    }
  }, [locationState?.authError]);

  // Declarative redirect rather than an imperative navigate() after login: a successful
  // login re-renders this component with a session, and this branch does the rest.
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleTabValueChange = (value: string | null) => {
    if (value === 'phone' || value === 'email') {
      setActiveTab(value);
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (activeTab === 'phone') {
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await onEmailNext(email);
    if (!result.ok) {
      setSubmitting(false);
      setError(result.message);
    }
  };

  return (
    // flex-1 rather than min-h-full: PageContainer owns the gutters and is the
    // flex column this fills, so the card stays centred in the space left over.
    <div className="flex flex-1 items-center justify-center">
      <SectionCard className="relative w-full max-w-sm overflow-hidden p-10">
        <div className="absolute left-0 top-9 h-11 w-1.5 rounded-r bg-primary" />

        <Heading1 bold>Verify your account</Heading1>
        <BodySmall className="mt-1" color="foreground-muted">
          Enter your mobile number or email address and we&apos;ll send you a
          verification code to sign in.
        </BodySmall>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Tabs onValueChange={handleTabValueChange} value={activeTab}>
            <TabsList
              aria-label="Sign-in method"
              className="w-full"
              variant="segmented"
            >
              <TabsTrigger size="segmented" tone="segmented" value="phone">
                <MobileIcon aria-hidden="true" className="size-3.5" />
                Mobile Phone
              </TabsTrigger>
              <TabsTrigger size="segmented" tone="segmented" value="email">
                <MailIcon aria-hidden="true" className="size-3.5" />
                Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phone">
              <TextInput
                aria-label="Mobile phone number"
                autoComplete="tel"
                className="border-input"
                inputMode="tel"
                placeholder="Enter mobile number"
                size="lg"
                startAdornment={<PhoneLineIcon className="size-4" />}
                type="tel"
                variant="soft"
              />
            </TabsContent>
            <TabsContent value="email">
              <TextInput
                aria-label="Email address"
                autoComplete="email"
                className="border-input"
                onChange={handleEmailChange}
                placeholder="Enter email address"
                required
                size="lg"
                startAdornment={<MailIcon className="size-4" />}
                type="email"
                value={email}
                variant="soft"
              />
            </TabsContent>
          </Tabs>

          {error !== null && <Callout variant="error">{error}</Callout>}

          <Button
            disabled={activeTab === 'phone'}
            loading={submitting}
            loadingText="Signing in…"
            size="lg"
            type="submit"
          >
            Next
            <ChevronRightIcon aria-hidden="true" className="size-3" />
          </Button>
        </form>

        <BodySmall
          className="mt-4 flex items-center justify-center gap-2 text-caption"
          color="foreground-muted"
        >
          <LockIcon aria-hidden="true" className="size-3.5 shrink-0" />
          Your information is secure and encrypted.
        </BodySmall>

        <div aria-hidden="true" className="mt-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-divider" />
          {/* text-placeholder reads 2.47:1 on white and fails AA; muted-foreground clears it. */}
          <span className="text-caption text-foreground-muted">or</span>
          <div className="h-px flex-1 bg-divider" />
        </div>

        {/* No destination is defined for this yet (PRD Non-Goals), so it renders
            as styled text rather than a link/button that would do nothing. */}
        <BodySmall className="mt-3 text-center font-semibold" color="primary">
          Need help signing in?
        </BodySmall>
      </SectionCard>
    </div>
  );
}
