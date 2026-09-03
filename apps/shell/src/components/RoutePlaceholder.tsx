import { BodySmall, Heading1, SectionCard } from '@cms/ui';

export interface RoutePlaceholderProps {
  label: string;
  section?: string;
}

/** Minimal stand-in for nav destinations that don't have a real page/MFE yet. */
export function RoutePlaceholder({ label, section }: RoutePlaceholderProps) {
  // Page gutters come from PageContainer in the shell, so this renders flush.
  return (
    <SectionCard>
      <BodySmall
        className="text-caption font-semibold tracking-section"
        color="foreground-muted"
        isUpperCase
      >
        {section ?? 'Navigation'}
      </BodySmall>
      <Heading1 bold className="mt-1">
        {label}
      </Heading1>
      <BodySmall className="mt-2" color="foreground-muted">
        This page hasn't been built yet — you're viewing the nav shell's
        placeholder for {section ? `${section} / ${label}` : label}.
      </BodySmall>
    </SectionCard>
  );
}
