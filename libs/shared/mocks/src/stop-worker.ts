/**
 * Drop a leftover worker after `VITE_USE_MOCK_API` is flipped off. The SW
 * file stays on disk; this only unregisters it so `fetch` reaches the network.
 * Kept out of `browser.ts` so the off-path does not load `msw/browser`.
 */
export async function stopMockWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter((registration) =>
        (registration.active?.scriptURL ?? '').includes('mockServiceWorker.js'),
      )
      .map((registration) => registration.unregister()),
  );
}
