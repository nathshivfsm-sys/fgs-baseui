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
