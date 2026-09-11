import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { standaloneRuntime } from './standalone-runtime';

async function bootstrap() {
  // Same gate as the shell. Federated Settings does not run this file — the
  // host worker already intercepts /api/v1 — this path is standalone only.
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
    const { startMockWorker } = await import('@cms/shared-mocks');
    await startMockWorker();
  } else if (import.meta.env.DEV) {
    const { stopMockWorker } = await import('@cms/shared-mocks');
    await stopMockWorker();
  }

  const container = document.getElementById('root');
  if (!container) throw new Error('#root element not found');

  createRoot(container).render(
    <StrictMode>
      <QueryClientProvider client={standaloneRuntime.queryClient}>
        <BrowserRouter
          basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}
        >
          <div className="mx-auto max-w-content p-4 sm:p-6">
            <App runtime={standaloneRuntime} />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
}

void bootstrap();
