import type { CmsRuntime } from '@cms/platform-contract';
import { SectionCard } from '@cms/ui';
import { RemoteErrorBoundary } from './error-boundary';
import './styles.css';

export interface AppProps {
  runtime: CmsRuntime;
}

export function App({ runtime }: AppProps) {
  return (
    <RemoteErrorBoundary>
      <section className="space-y-4" data-testid="invoice">
        <div>
          <h2 className="text-2xl font-bold">Invoice</h2>
          <p className="text-xs text-muted-foreground">
            Global tenant: {runtime.tenantId} · User:{' '}
            {runtime.currentUser.displayName} ({runtime.currentUser.role})
          </p>
        </div>
        <SectionCard>
          <p className="text-sm text-muted-foreground">
            Invoice remote is running. Replace this with real content.
          </p>
        </SectionCard>
      </section>
    </RemoteErrorBoundary>
  );
}

export default App;
