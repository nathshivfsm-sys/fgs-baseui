import { BodySmall } from '@cms/ui';

export interface SettingsEmptyStateProps {
  query: string;
}

export function SettingsEmptyState({ query }: SettingsEmptyStateProps) {
  return (
    <BodySmall color="foreground-subtle" role="status">
      No settings match "{query}"
    </BodySmall>
  );
}
