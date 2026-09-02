import { SectionCard } from '@cms/ui';

export interface RoutePlaceholderProps {
  label: string;
  section?: string;
}

/** Minimal stand-in for nav destinations that don't have a real page/MFE yet. */
export function RoutePlaceholder({ label, section }: RoutePlaceholderProps) {
  // Page gutters come from PageContainer in the shell, so this renders flush.
  return (
    <SectionCard>
      <p className="text-caption font-semibold uppercase tracking-section text-foreground-muted">
        {section ?? 'Navigation'}
      </p>
      <h1 className="mt-1 text-title font-bold text-heading">{label}</h1>
      <p className="mt-2 text-control text-foreground-muted">
        This page hasn't been built yet — you're viewing the nav shell's
        placeholder for {section ? `${section} / ${label}` : label}.
      </p>
    </SectionCard>
  );
}
