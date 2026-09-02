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
      <div className="mx-auto max-w-content p-page-compact sm:p-page">
        <App />
      </div>
    </QueryClientProvider>
  </StrictMode>,
);
