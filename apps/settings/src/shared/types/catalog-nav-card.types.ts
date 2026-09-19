import type { ReactNode } from 'react';

export interface CatalogNavCardProps {
  activeCount?: number;
  description: string;
  icon: ReactNode;
  iconClassName?: string;
  onSelect: () => void;
  selected: boolean;
  title: string;
}
