import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@cms/shared-auth';
import { BrowserRouter } from 'react-router-dom';
import { loadRuntimeConfig } from './config';
import { authenticateWithApi } from './util';
import { registerProviders } from './mf';
import { cmsRuntime } from './runtime';
import './styles.css';

async function bootstrap() {
  // Dynamic import so `msw/browser` stays out of the production bundle. The
  // flag is the only switch: query functions and `customFetch` are unchanged.
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
    const { startMockWorker } = await import('@cms/shared-mocks');
    await startMockWorker();
  } else if (import.meta.env.DEV) {
    const { stopMockWorker } = await import('@cms/shared-mocks');
    await stopMockWorker();
  }

  const config = await loadRuntimeConfig();
  registerProviders(config.remotes);
  const { App } = await import('./App');
  const container = document.getElementById('root');
  if (!container) throw new Error('#root element not found');

  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

  createRoot(container).render(
    <StrictMode>
      <QueryClientProvider client={cmsRuntime.queryClient}>
        <AuthProvider authenticate={authenticateWithApi}>
          <BrowserRouter basename={basename}>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

void bootstrap();
