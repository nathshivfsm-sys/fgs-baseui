import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, DEMO_SESSION } from '@cms/shared-auth';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { standaloneRuntime } from './standalone-runtime';

const container = document.getElementById('root');
if (!container) throw new Error('#root element not found');

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={standaloneRuntime.queryClient}>
      {/* Standalone dev has no login screen, so the session is seeded: protected routes
          render directly at /, and /payment/:invoiceId still exercises the public path. */}
      <AuthProvider initialSession={DEMO_SESSION}>
        <BrowserRouter>
          {/* Stands in for the shell's PageContainer: the pages render flush and
              rely on whoever hosts them for the gutters. */}
          <div className="mx-auto max-w-content p-4 sm:p-6">
            <App runtime={standaloneRuntime} />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
