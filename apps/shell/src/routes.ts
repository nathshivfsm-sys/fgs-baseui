/**
 * Paths that render under the logo-only chrome instead of the authenticated sidebar and
 * top nav, so an anonymous visitor is never shown the protected navigation tree.
 *
 * This is the shell's only knowledge of a remote's route table, and it is a *layout*
 * decision alone — whether a route requires a session is decided inside the remote that
 * owns it (see apps/invoice/src/App.tsx).
 */
export const PUBLIC_ROUTE_PATTERNS: readonly string[] = [
  '/login',
  '/invoice/payment/:invoiceId',
];
