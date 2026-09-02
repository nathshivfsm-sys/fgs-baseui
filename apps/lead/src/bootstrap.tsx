import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { standaloneRuntime } from './standalone-runtime';

const container = document.getElementById('root');
if (!container) throw new Error('#root element not found');

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={standaloneRuntime.queryClient}>
      {/* Stands in for the shell's PageContainer: the remote renders flush and
          relies on whoever hosts it for the gutters. */}
      <div className="mx-auto max-w-content p-4 sm:p-6">
        <App runtime={standaloneRuntime} />
      </div>
    </QueryClientProvider>
  </StrictMode>,
);
