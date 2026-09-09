import { Body, BodySmall, HexLogoIcon } from '@cms/ui';
import type { ReactNode } from 'react';
import { PageContainer } from './PageContainer';

export interface PublicShellProps {
  children: ReactNode;
}

/**
 * Decorative curves bleeding off the right edge of the banner. Purely
 * visual (aria-hidden) — kept local to `PublicShell` rather than in the
 * shared icon library since it's background art for this one banner, not a
 * reusable glyph.
 */
function BrandBannerArt() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 h-full w-auto text-white"
      fill="none"
      preserveAspectRatio="xMaxYMid slice"
      viewBox="0 0 519.16 692.5"
    >
      <g clipPath="url(#brand-banner-art-clip)">
        <path
          d="M593.326 432.777C825.436 432.777 1013.6 244.614 1013.6 12.5043C1013.6 -219.606 825.436 -407.768 593.326 -407.768C361.216 -407.768 173.053 -219.606 173.053 12.5043C173.053 244.614 361.216 432.777 593.326 432.777Z"
          fill="currentColor"
          opacity="0.12"
        />
        <path
          d="M568.604 420.416C759.753 420.416 914.71 265.458 914.71 74.3091C914.71 -116.84 759.753 -271.798 568.604 -271.798C377.454 -271.798 222.497 -116.84 222.497 74.3091C222.497 265.458 377.454 420.416 568.604 420.416Z"
          fill="currentColor"
          opacity="0.1"
        />
        <path
          d="M-49.4438 902.493C87.0915 902.493 197.775 813.946 197.775 704.718C197.775 595.489 87.0915 506.942 -49.4438 506.942C-185.979 506.942 -296.663 595.489 -296.663 704.718C-296.663 813.946 -185.979 902.493 -49.4438 902.493Z"
          fill="currentColor"
          opacity="0.08"
        />
      </g>
      <defs>
        <clipPath id="brand-banner-art-clip">
          <rect fill="white" height="692.5" width="519.16" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Blue brand banner used by every public page, in place of the authenticated top nav. */
function BrandBanner() {
  return (
    <header className="relative flex h-[8.3125rem] shrink-0 items-center overflow-hidden bg-primary px-6 shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.25)] sm:px-8">
      <BrandBannerArt />
      <div className="relative z-10 flex items-center gap-3">
        <HexLogoIcon aria-hidden="true" className="size-14 shrink-0" />
        <div>
          <Body className="text-[2.625rem] font-extrabold leading-none tracking-tight text-white">
            FSM
          </Body>
          <BodySmall className="mt-1 text-white/70">
            Field Service Management
          </BodySmall>
        </div>
      </div>
    </header>
  );
}

/** Legal links and copyright shown under every public page's content. */
function PublicFooter() {
  return (
    <footer className="shrink-0 px-6 py-6 text-center">
      {/* No destinations are defined for these yet, so they render as inert text
          rather than links that would go nowhere. */}
      <BodySmall
        className="flex items-center justify-center gap-2 text-caption"
        color="foreground-muted"
      >
        <span>Privacy Policy</span>
        <span aria-hidden="true">•</span>
        <span>Terms of Service</span>
        <span aria-hidden="true">•</span>
        <span>Support</span>
      </BodySmall>
      <BodySmall className="mt-2 text-caption" color="placeholder">
        © 2025 FSM. All rights reserved.
      </BodySmall>
    </footer>
  );
}

/** Chrome for pages an anonymous visitor can reach: brand banner, no navigation. */
export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <BrandBanner />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <PageContainer>{children}</PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
}
