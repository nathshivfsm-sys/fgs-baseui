import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

const worker = setupWorker(...handlers);

/**
 * Register the MSW service worker. Call only after the host has decided mock
 * mode is on — this module pulls in `msw/browser` and must stay dynamically
 * imported from app bootstrap.
 */
export async function startMockWorker(): Promise<void> {
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
  console.info('[MSW] Mocking /api/v1 (auth + settings catalog)');
}
