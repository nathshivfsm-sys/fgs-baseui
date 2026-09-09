/**
 * Vite `base` for GitHub Pages project-site deploys.
 *
 * Locally this is `/`. In CI, `VITE_BASE_PATH` is the Pages path from
 * `actions/configure-pages` (e.g. `/fgs-baseui/`). Remotes nest under
 * `mf/<name>/` so their assets do not collide with shell routes such as
 * `/settings` or `/invoice`.
 */
export function viteBase(remoteName?: string): string {
  const raw = process.env.VITE_BASE_PATH;
  if (!raw) return '/';
  const repoBase = raw.endsWith('/') ? raw : `${raw}/`;
  return remoteName ? `${repoBase}mf/${remoteName}/` : repoBase;
}
