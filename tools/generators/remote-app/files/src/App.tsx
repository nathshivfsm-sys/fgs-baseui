import type { CmsRuntime } from '@cms/platform-contract';
import { BodySmall, Heading2, SectionCard } from '@cms/ui';
import { RemoteErrorBoundary } from './error-boundary';
import './styles.css';

export interface AppProps {
  runtime: CmsRuntime;
}

export function App({ runtime }: AppProps) {
  return (
    <RemoteErrorBoundary>
      <section className="space-y-4" data-testid="<%= name %>">
        <div>
          <Heading2 bold className="text-2xl">
            <%= displayName %>
          </Heading2>
          <BodySmall className="text-caption" color="foreground-muted">
            Global tenant: {runtime.tenantId} · User:{' '}
            {runtime.currentUser.displayName} ({runtime.currentUser.role})
          </BodySmall>
        </div>
        <SectionCard>
          <BodySmall color="foreground-muted">
            <%= displayName %> remote is running. Replace this with real content.
          </BodySmall>
        </SectionCard>
      </section>
    </RemoteErrorBoundary>
  );
}

export default App;
