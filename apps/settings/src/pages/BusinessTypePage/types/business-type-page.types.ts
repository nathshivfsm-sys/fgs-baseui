import type { QueryClient } from '@tanstack/react-query';
import type { BusinessTypeSummaryDto } from '@cms/settings-contract';

export interface BusinessTypePageProps {
  queryClient: QueryClient;
}

export interface BusinessTypeListProps {
  enablingId: number | null;
  items: readonly BusinessTypeSummaryDto[];
  onEnable: (record: BusinessTypeSummaryDto) => void;
}

export interface BusinessTypeRowProps {
  enabling: boolean;
  onEnable: (record: BusinessTypeSummaryDto) => void;
  record: BusinessTypeSummaryDto;
}

export interface BusinessTypeMarkProps {
  code: string | null | undefined;
  name: string | null | undefined;
}
